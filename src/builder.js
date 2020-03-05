const debug = require('debug')('builder');
const { prepareSheetData, prepareSpreadsheetData, } = require('./prepare');
const { sheetDetails } = require('./sheet');
const { getSheets } = require('./sheets-api');

async function build(client, spreadsheetId, sheetNames, options) {

	const opts = {
		columnKeys: 'legacy',
		...options,
	};

	const sheets = sheetNames.map(sheetDetails)
	const sheetsData = await getSheets(client, spreadsheetId, sheets, prepareSheetData)
	const result = prepareSpreadsheetData(sheets, sheetsData)

	return result;
}

module.exports = {
	build,
}