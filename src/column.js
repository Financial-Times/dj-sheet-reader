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

module.exports = {
	columnHeaderToObjectKey,
	column,
	getFormatterFunction,
};