const debug = require('debug')('builder')
const { prepareSheetData, prepareSpreadsheetData, } = require('./prepare')
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
		return prepareSpreadsheetData(sheets, sheetsData)
	} catch (error) {
		if (!error.statusCode) {
			console.error(`Error: message=${error.message}`)
			throw createError(500, error, { expose: true })
		} else {
			console.error(`Error: statusCode=${error.statusCode} message=${error.message}`)
		}
		throw error
	}
}

module.exports = {
	build,
}