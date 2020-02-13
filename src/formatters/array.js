const { basic } = require('./basic');

function list(val, delimiter) {
	val = (val || '').trim();
	return !val.length ? [] : val.toString().split(delimiter || ',').map(basic);
}

function array(val) {
	return list(val, /[\r\n]+/gm);
}

function wrapParse(d) {
	return function (val) {
		return list(val, d);
	}
}

function parse2d(val, delimiter1, delimiter2) {
	return list(val, delimiter1 || /\r?\n/gm).map(wrapParse(delimiter2 || ','));
}

function md2(val) {
	return parse2d(val);
}

function md2semi(val) {
	return parse2d(val, null, ';');
}

function map(val) {

	if (!val || !val.length) {
		return null;
	}

	var obj = {};

	var lines = list(val, /\r?\n/gm)
		.map(function (v) {
			return list((v || '').toString().replace(/[\,\ \;]+$/, '').replace(/^[\ \t]+/, ''), ':');
		})
		.forEach(function (arr) {
			if (arr && arr.length) {
				if (arr.length > 1) {
					obj[arr[0]] = arr[1];
				} else {
					obj[arr[0]] = null;
				}
			}
		});

	return obj;
}

module.exports = {
	list: list,
	li: list,
	array,
	arr: array,

	// TODO: Confirm if these are used. Deprecate 
	md2,
	md2semi,
	map,
};