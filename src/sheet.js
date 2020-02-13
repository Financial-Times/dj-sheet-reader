const { column } = require('./column');

function isRestricted(raw) {
	if (!raw) return false;
	return /^(y|yes|true|ok|on)$/i.test(raw.trim());
}

function sheet(rawData) {

	const firstRow = rawData.shift();
	const cols = firstRow.map(column).filter(col => Boolean(col.key));

	const restrictRowCol = cols.findIndex(
		col => col.isSpecialRestrict
	);

	// todo: append _2 to columnName

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