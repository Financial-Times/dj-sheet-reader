const { set } = require('lodash')
const { sheet } = require('./sheet')

function prepareSheetData(rawData) {
	const { columns, rows } = sheet(rawData)
	const numRows = rows.length

	if (!numRows || !columns.length) {
		return []
	}

	const result = rows.map(() => ({}))

	for (let column of columns) {
		for (let rowIndex = 0; rowIndex < numRows; rowIndex++) {
			// todo: why are some empty string and others undefined
			// todo: current impl has nulls for empty cells
			const value = column.formatter(rows[rowIndex][column.index])
			const row = result[rowIndex]
			set(row, column.key, value)
		}
	}

	return result
}

function prepareSpreadsheetData(sheets, sheetsData, options) {
	options = options || {}

	if (options.columnKeys) {
		// todo: needs implementing
	}

	// shallow copy array to preserve order
	// of the sheets (see note about sheet order below)
	sheets = sheets.concat()

	const result = {}

	// _Bertha legacy compatibility #1:_
	// Legacy behaviour
	// 1. An optional sheet that exists, but has zero rows, produces and empty array
	// 2. An optional sheet that does not exist produces undefined
	// New behaviour
	// It's not possible to replicate the legacy behaviour so the new way is (1) in all cases - empty array.

	// _Bertha legacy compatibility #2:_
	// Object props are declared in the order sheetNames were specified.
	// This helps to make the JSON output predictable and consistent
	// Which is good for caching, etag creation etc.
	sheets.forEach((sheet, index) => {
		result[sheet.key] = sheetsData[index]
	})

	return result
}

module.exports = {
	prepareSheetData,
	prepareSpreadsheetData,
}
