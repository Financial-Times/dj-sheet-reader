const { google } = require('googleapis');
const createError = require('http-errors');
const { FetchError } = require('node-fetch');
const debug = require('debug')('sheetsAPI');
const { Agent } = require('https');
const AbortController = require('abort-controller');
const pTimeout = require('p-timeout');

const agent = new Agent({ keepAlive: true, keepAliveMsecs: 1 });

function getSpreadsheetClient(email, subject, key) {
	try {		
		return google.sheets({
			version: 'v4',
			auth: new google.auth.JWT({
				// todo: find out how long the JWT expiry is
				// todo: refresh the token
				email: email || EMAIL,
				key: key || KEY,
				scopes: ['https://www.googleapis.com/auth/drive'],
				subject: subject || SUBJECT,
			})
		});
	} catch (error) {
		debug(error);
		throw error;
	}
}

async function getSheets(client, spreadsheetId, sheets, transformSheet) {
	if (!spreadsheetId) {
		throw new new createError.BadRequest('spreadsheetId is required');
	}

	if (!sheets) {
		throw new createError.BadRequest('sheetNames is required');
	}

	const controller = new AbortController();

	try {
		const timeout = 1000 * 19;
		const timeoutError = new createError.RequestTimeout(`Google API timed out spreadsheetId=${spreadsheetId}`);
		const promises = sheets.map(sheet => (
			getSheet(client, spreadsheetId, sheet.sheetName, sheet.optional, controller.signal).then(transformSheet)
		));
		return await pTimeout(Promise.all(promises), timeout, timeoutError)
	} catch(error) {
		controller.abort()
		throw error
	}
}

async function getSheet(client, spreadsheetId, sheetName, isOptional, signal) {

	if (!spreadsheetId) {
		throw new createError.BadRequest('Spreadsheet ID required')
	}

	if (!sheetName) {
		throw new createError.BadRequest('Sheet name required')
	}

	const nodeFetchOptions = {
		timeout: 1000 * 20,
		agent,
	};

	if (signal) {
		nodeFetchOptions.signal = signal;
	}

	try {
		debug(`Request spreadsheetId=${spreadsheetId} sheetName=${sheetName}`)
		const response = await client.spreadsheets.values.get({
			spreadsheetId,
			range: sheetName,
			majorDimension: 'ROWS',
		}, nodeFetchOptions)
		const values = response.data.values || []
		debug(`Response spreadsheetId=${spreadsheetId} sheetName=${sheetName} rowCount=${values.length}`)
		return values;
	} catch (error) {

		if (signal && signal.aborted && error.name && error.name === 'AbortError') {
			debug('Ignore error after aborted request');
			return;
		}

		debug(error);

		if (error.code) {
			switch (error.code) {
				case 400:
					if (Array.isArray(error.errors) && Boolean(error.errors.length) && error.errors[0].message === `Unable to parse range: ${sheetName}`) {
						throw new createError.NotFound(`Sheet not found: sheetName="${sheetName}"`)
					} 
					throw new createError.BadRequest('Bad Request [possibly invalid spreadsheet ID]')
				case 403:
					throw new createError.Forbidden(`No permission to access spreadsheet`)
				case 404:
					throw new createError.NotFound(`Spreadsheet not found: spreadsheetId=${spreadsheetId}`)
				case 'ETIMEDOUT':
					throw new createError.RequestTimeout(`Network timed out`)
				case 'ENOTFOUND':
				case 'ESOCKETTIMEDOUT':
					throw new createError.InternalServerError(`Network Error - ${error.code}`)
				case 'ERR_OSSL_PEM_BAD_END_LINE':
				case 'ERR_OSSL_ASN1_SEQUENCE_NOT_CONSTRUCTED':
				case 'ERR_OSSL_PEM_BAD_BASE64_DECODE':
					if (error.reason) {
						throw new createError.InternalServerError(`AUTH - ${error.code} - ${error.reason}`)
					}
					throw new createError.InternalServerError('Internal error - AUTHX')
				case '400': // Error code is a string number!
					if (error.response && error.response.data) {
						if (error.response && error.response.status && (error.response.status === 500 || error.response.status === 400)) {
							let message; 
							if (error.response.data.error === 'invalid_grant') {
								message = `Google Auth: ${error.response.data.error_description}`
							} else {
								message = `4RS - ${error.response.data.error}: ${error.response.data.error_description}`;
							}
							throw new createError.InternalServerError(message);
						}
						throw new createError.InternalServerError(`NRS - ${error.response.data.error}: ${error.response.data.error_description}`)
					}
				default:
					break;
			}
		}

		if (error instanceof FetchError) {
			switch (error.type) {
				case 'request-timeout':
					if (isOptional) {
						debug('Google API timeout on optional sheet - assume empty array')
						return [];
					}
					throw new createError.RequestTimeout(`Google API timed out spreadsheetId=${spreadsheetId} sheetName=${sheetName}`);
				case 'system':
					throw new createError.InternalServerError(`FetchError system error: ${error.message}`);
				default:
					break;
			}
		}

		throw error;
	}
}

module.exports = {
	getSpreadsheetClient,
	getSheet,
	getSheets,
};