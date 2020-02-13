function int(val) {
	var res = parseInt(val, 10);
	return isNaN(res) ? null : res;
}

function getDecimalParser(dp) {
	dp = dp || 0;
	return function (val) {
		if (val == null) {
			return null;
		}

		try {
			var n = Number(val);
			return isNaN(n) ? val : n.toFixed(dp);
		} catch (e) {
			return val;
		}
	}
}

module.exports = {
	int,
	dp0: int,
	dp1: getDecimalParser(1),
	dp2: getDecimalParser(2),
	dp3: getDecimalParser(3),
	dp3: getDecimalParser(3),
};