const { columns } = require('./column')
const { partition } = require('lodash')

function isRestricted(raw) {
	if (!raw) return false
	return /^(y|yes|true|ok|on)$/i.test(raw.trim())
}

function sheet(rawData) {
	const firstRow = rawData.shift() || []
	const columnDescriptors = columns(firstRow)
	const [restrictedColumns, unRestictedColumns] = partition(columnDescriptors, 'isRestricted')

	let rows = rawData

	if (restrictedColumns.length) {
		// Loop through columns because we want to err on the side of safety
		// in case there are 2 or more "special.restrict" columns on the sheet
		for (let { index } of restrictedColumns) {
			rows = rows
				.filter((row) => !isRestricted(row[index]))
				.map((row) => {
					// remove the data in the restricted column cell
					row[index] = undefined
					return row
				})
		}
	}

	return {
		rows,
		columns: unRestictedColumns,
	}
}

function sheetKey(sheetName) {
	if (sheetName === 0) return '0'
	// todo: investigate: do we need to trim this string or remove chars
	return (sheetName || '').toString()
}

function sheetDetails(sheetName) {
	// todo: what if there's a leading space eg " +optional sheet"
	const optional = sheetName.charAt(0) === '+'
	sheetName = optional ? sheetName.substring(1) : sheetName
	const key = sheetKey(sheetName)
	return {
		sheetName,
		key,
		optional,
	}
}

module.exports = {
	sheet,
	sheetKey,
	sheetDetails,
	isRestricted,
}
