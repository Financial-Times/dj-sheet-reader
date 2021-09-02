const { basic } = require('./basic')

function json(val) {
	if (!val || !val.length) {
		return null
	}

	let obj = {}

	try {
		const sanitized = (val || '')
			.replace(/[\n\r\t]/g, '')
			.replace(/^\{/, '')
			.replace(/\}$/, '')
			.replace(/\,+$/, '')
		obj = JSON.parse('{' + sanitized + '}')
	} catch (e) {
		obj = basic(val)
	}

	return obj
}

module.exports = {
	json,
}
