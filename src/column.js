const groupBy = require('lodash.groupby');
const formatters = require('./formatters/all');

function getFormatterFunction(name) {
	if (name && formatters.hasOwnProperty(name) && typeof formatters[name] === 'function') {
		return { formatter: formatters[name], formatterName: name };
	}
	return { formatter: formatters.basic, formatterName: 'basic' };
}

function columnHeaderToObjectKey(header) {
	return (header || '')
		.trim()
		.toLowerCase()
		.replace(/[\s\-\_\n\r]/gm, '');
}

function column(value, index) {
	const [title, _formatterName] = (value || '').trim().split('..');
	const key = columnHeaderToObjectKey(title);
	const { formatter, formatterName } = getFormatterFunction(_formatterName);
	return {
		key,
		index,
		formatterName,
		formatter,
		isSpecial: key.startsWith('special.'),
		isSpecialRestrict: key === 'special.restrict',
	};
}

function columns(row) {
	const cols = row.map(column).filter(col => Boolean(col.key))

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

	return cols;
}

module.exports = {
	columnHeaderToObjectKey,
	column,
	columns,
	getFormatterFunction,
}