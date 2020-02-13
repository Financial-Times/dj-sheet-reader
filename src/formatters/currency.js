function currency(val) {
	if (typeof val === 'string' && val.length === 0) {
		val = null;
	}

	return { value: val, symbol: val };
}

module.exports = {
	currency,
	curr: currency,
};