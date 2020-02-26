const set = require('lodash.set');
const debug = require('debug')('builder');
const { sheet, sheetDetails } = require('./sheet');
const { getSheet } = require('./sheets-api');

function prepareSheetData() {
	return function processSheet(rawData) {

		const { columns, rows } = sheet(rawData);
		const numRows = rows.length;

		if (!numRows) {
			return rows;
		}

		const result = rows.map(() => ({}));

		for (let column of columns) {
			for (let rowIndex = 0; rowIndex < numRows; rowIndex++) {
				// todo: why are some empty string and others undefined
				// todo: current impl has nulls for empty cells
				const value = column.formatter(rows[rowIndex][column.index]);
				const row = result[rowIndex];
				set(row, column.key, value);
			}
		}

		return result;
	}
}

function prepareSpreadsheetData(sheets) {

	// shallow copy array to preserve order
	// of the sheets (see note about sheet order below)
	sheets = sheets.concat();

	return function processSheets(sheetsData) {
		const combinedSheets = {};

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
			combinedSheets[sheet.key] = sheetsData[index];
		})

		return combinedSheets;
	}
}

function build(client, spreadsheetId, sheetNames, options) {

	const defaultOptions = {
		columnKeys: 'legacy',
	};

	const sheets = sheetNames.map(sheetDetails);
	const opts = Object.assign({}, defaultOptions, options || {});

	const promises = sheets.map(
		sheet => getSheet(
			client,
			spreadsheetId,
			sheet.sheetName
		)
		.then(prepareSheetData())
		// todo: catch error and cancel all promises?
		// .catch(onError)
	);

	return Promise.all(promises).then(prepareSpreadsheetData(sheets))
}

module.exports = {
	build,
}