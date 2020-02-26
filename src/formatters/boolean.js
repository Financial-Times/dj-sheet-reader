// function use internally by other formatters (can return non-boolean values)
function _bool(val) {
	let bool;
	try {
		val = (val || '').trim();
		if (/^(y|yes|true)$/i.test(val)) {
			bool = true;
		} else if (/^(n|no|false)$/i.test(val)) {
			bool = false;
		}
	} catch (e) { }
	return bool;
}

// the function reference in spreadsheet. Must return a boolean value
function bool(val) {
	if (typeof val === 'boolean') {
		return val;
	}
	if (val === 0) {
		return false;
	}
	if (val === 1) {
		return true;
	}
	return _bool(val) || false;
}

module.exports = {
	bool,
	boolean: bool,
	_bool,
};