const groupBy = require('lodash.groupby');
const { column } = require('./column');


function isRestricted(raw) {
	if (!raw) return false;
	return /^(y|yes|true|ok|on)$/i.test(raw.trim());
}

function sheet(rawData) {

	const firstRow = rawData.shift() || [];
	const cols = firstRow.map(column).filter(col => Boolean(col.key));

	const restrictRowCol = cols.findIndex(
		col => col.isSpecialRestrict
	);

	// # Bertha legacy compatibility:
	// Rename duplicate columns keys, adding a number to the key
	// e.g if two cols are called "foo", the second (moving left-to-right in the sheet) would be "foo_2"
	// this includes columns with namespaces: the second "foo.bar" would become "foo.bar_2"
	const groupedByKey = Object.entries(groupBy(cols, 'key')).forEach(([key, cols]) => {
		if (cols.length < 2) return;
		cols.slice(1).forEach((col, i) => {
			// This only works because we assume column keys don't
			// contain underscores. Otherwise we'd have to check
			// the new suffixed key isn't already in use on another column.
			col.key = `${col.key}_${i + 2}`;
		});
	});

	let rows;
	
	if (restrictRowCol === -1) {
		rows = rawData;
	} else {
		rows = rawData.filter(
			row => !isRestricted(row[restrictRowCol])
		);
	}

	return {
		rows,
		columns: cols.filter(col => !col.isSpecial),
	};
}

function sheetKey(sheetName) {
	return sheetName;
}

function sheetDetails(sheetName) {
	const optional = sheetName.charAt(0) === '+';
	sheetName = optional ? sheetName.substring(1) : sheetName;
	const key = sheetKey(sheetName);
	return {
		sheetName,
		key,
		optional,
	};
}

module.exports = {
	sheet,
	sheetKey,
	sheetDetails,
};