const jsYaml = require('js-yaml')

function yaml(val) {
	if (!val) return val

	val = val.trim()

	try {
		return jsYaml.safeLoad(val, { schema: jsYaml.JSON_SCHEMA })
	} catch (e) {
		return { value: val, error: { message: 'YAML format error', line: e.line, column: e.column } }
	}
}

module.exports = {
	yaml,
	yml: yaml,
}
