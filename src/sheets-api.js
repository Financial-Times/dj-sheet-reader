const { google } = require('googleapis');
const { NotFound, Forbidden, BadRequest, InternalServerError, RequestTimeout } = require('http-errors');
const debug = require('debug')('sheetsAPI');

function getSpreadsheetClient(email, subject, key) {
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
}

async function getSheet(client, spreadsheetId, sheetName) {

	if (!spreadsheetId) {
		throw new BadRequest('Spreadsheet ID required');
	}

	if (!sheetName) {
		throw new BadRequest('Sheet name required');
	}

	try {
		debug(`Request spreadsheetId=${spreadsheetId} sheetName=${sheetName}`)
		const response = await client.spreadsheets.values.get({
			spreadsheetId,
			range: sheetName,
			majorDimension: 'ROWS',
		})
		const values = response.data.values || []
		debug(`Response spreadsheetId=${spreadsheetId} sheetName=${sheetName} rowCount=${values.length}`)
		return values;
	} catch (error) {
		if (error.code) {
			switch (error.code) {
				case 400:
					throw new BadRequest('Bad Request [possibly invalid spreadsheet ID]')
				case 403:
					throw new Forbidden(`No permission to access spreadsheet`)
				case 404:
					throw new NotFound(`Spreadsheet not found`)
				case 'ETIMEDOUT':
					throw new RequestTimeout(`Google API timed out`)
				case 'ENOTFOUND':
				case 'ESOCKETTIMEDOUT':
					throw new InternalServerError('Network Error')
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
};