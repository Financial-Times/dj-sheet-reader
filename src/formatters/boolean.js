// function use internally by other formatters (can return non-boolean values)
function _bool(val) {
	val = (val || '').trim();
	let bool;
	try {
		if (/^(y|yes|true)$/i.test(val)) {
			bool = true;
		} else if (/^(n|no|false)$/i.test(val)) {
			bool = false;
		}
	} catch (e) { }
	return bool;
}

// the function reference in spreadsheet. Must return a boolean value
function bool() {
	return _bool(val) || false;
}

module.exports = {
	bool,
	boolean: bool,
	_bool,
};