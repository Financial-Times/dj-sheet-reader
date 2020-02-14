const set = require('lodash.set');
const debug = require('debug')('builder');
const { sheet, sheetDetails } = require('./sheet');
const { getSheet } = require('./sheets-api');

function prepareSheet(rawData) {

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

function dataPreparer(sheets) {

	// shallow copy array to preserve order
	// of the sheets (see note about sheet order below)
	sheets = sheets.concat();

	return function prepareAllData(sheetsData) {
		const combinedSheets = {};

		// # Bertha legacy compatibility 1:
		// Object props are declared in the order sheetNames were specified.
		// This helps to make the JSON output predictable and consistent
		// Which is good for caching, etag creation etc.
		sheets.forEach((sheet, index) => {

			const data = sheetsData[index];

			// # Bertha legacy compatibility 2:
			// optional sheets with with no data are not included in the response.
			// mandatory sheets with no data return an empty array
			if (sheet.optional && !data.length) {
				return;
			}

			combinedSheets[sheet.key] = data;
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

	function onOptionalSheetError(error) {
		// todo confirm empty array is correct behaviour
		console.log('Didnt find optional sheet')
		return [];
	}

	function onMandatorySheetError(error) {
		// todo: compare current implementation. do we want to immediately re-throw or do we want to gather a list of all missing sheets?
		console.error('Didnt find Mandatory sheet')
		throw error;
	}

	const promises = sheets.map(
		sheet => getSheet(
			client,
			spreadsheetId,
			sheet.sheetName
		)
			.then(prepareSheet)
			.catch(sheet.optional ? onOptionalSheetError : onMandatorySheetError)
	);

	return Promise.all(promises).then(dataPreparer(sheets));
}

module.exports = {
	build,
};