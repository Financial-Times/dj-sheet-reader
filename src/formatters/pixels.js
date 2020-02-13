function pixels(val) {
	return (types.str(val) || 0) + 'px';
}

module.exports = {
	pixels,
	px: pixels,
};