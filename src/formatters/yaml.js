const { load, JSON_SCHEMA } = require('js-yaml')

function yaml(val) {
	if (!val) return val

	val = val.trim()

	try {
		return load(val, { schema: JSON_SCHEMA })
	} catch (e) {
		return { value: val, error: { message: 'YAML format error', line: e.line, column: e.column } }
	}
}

module.exports = {
	yaml,
	yml: yaml,
}
