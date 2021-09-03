function pixels(val) {
	return ((val || '').toString() || 0) + 'px'
}

module.exports = {
	pixels,
	px: pixels,
}
