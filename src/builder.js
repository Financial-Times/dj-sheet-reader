const debug = require('debug')('builder');
const { prepareSheetData, prepareSpreadsheetData, } = require('./prepare');
const { sheetDetails } = require('./sheet');
const { getSheet } = require('./sheets-api');

async function build(client, spreadsheetId, sheetNames, options) {

	const opts = {
		columnKeys: 'legacy',
		...options,
	};

	if (!spreadsheetId) {
		throw new Error('spreadsheetId is required');
	}

	if (!sheetNames) {
		throw new Error('sheetNames is required');
	}

	const sheets = sheetNames.map(sheetDetails);

	const promises = sheets.map(sheet => (
		getSheet(client, spreadsheetId, sheet.sheetName, sheet.optional).then(prepareSheetData)
		// todo: catch error and cancel all promises?
		// .catch(onError)
	));

	const sheetsData = await Promise.all(promises);
	const result = prepareSpreadsheetData(sheets, sheetsData);

	return result;
}

module.exports = {
	build,
}