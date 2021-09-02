const { _bool } = require('./boolean')

function basic(val) {
	val = val || ''

	val = val.trim()

	let res
	const bool = _bool(val)
	const num = Number(val.replace(/,/g, ''))

	if (typeof val === 'string' && (val.length === 0 || val.toLowerCase() === 'null')) {
		return null
	}

	if (typeof bool === 'boolean') {
		res = bool
	} else if (!isNaN(num)) {
		res = num
	} else if (typeof val === 'string') {
		res = val
	}

	return res
}

module.exports = {
	basic,
}
