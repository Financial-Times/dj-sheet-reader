const createError = require('http-errors')
const { prepareSheetData, prepareSpreadsheetData } = require('./prepare')
const { sheetDetails } = require('./sheet')
const { getSheets } = require('./sheets-api')

async function build(client, spreadsheetId, sheetNames, options) {
	const opts = {
		columnKeys: 'legacy',
		...options,
	}

	try {
		const sheets = sheetNames.map(sheetDetails)
		const sheetsData = await getSheets(client, spreadsheetId, sheets, prepareSheetData)
		return prepareSpreadsheetData(sheets, sheetsData, opts)
	} catch (error) {
		if (!error.statusCode) {
			throw createError(500, error, { expose: true })
		}
		throw error
	}
}

module.exports = {
	build,
}
