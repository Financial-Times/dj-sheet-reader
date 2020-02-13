const { google } = require('googleapis');
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
	try {
		debug(`Fetch spreadsheetId=${spreadsheetId} sheetName=${sheetName}`)
		const { data: { values } } = await client.spreadsheets.values.get({
			spreadsheetId,
			range: sheetName,
			majorDimension: 'ROWS',
		})
		debug(`Values spreadsheetId=${spreadsheetId} sheetName=${sheetName} rowCount=${values.length}`)
		return values;
	} catch (error) {
		// todo sheet fetch error handling.
		debug(`Error fetching message=${error.message} spreadsheetId=${spreadsheetId} sheetName=${sheetName}`)
		throw error;
	}
}

module.exports = {
	getSpreadsheetClient,
	getSheet,
};