const { groupBy } = require('lodash')
const formatters = require('./formatters/all')

function getFormatterFunction(name) {
	if (name && Object.prototype.hasOwnProperty.call(formatters, name) && typeof formatters[name] === 'function') {
		return { formatter: formatters[name], formatterName: name }
	}
	return { formatter: formatters.basic, formatterName: 'basic' }
}

function columnHeaderToObjectKey(header) {
	const key = (header || '')
		.toString()
		.trim()
		.toLowerCase()
		.replace(/[^a-z0-9.-]/gm, '')
		.replace(/^[\d.-]+/, '') // remove leading digits and dots

	if (key.startsWith('special.')) {
		return key // don't remove trailing dots
	}

	return key.replace(/\.+$/, '') // remove trailing dots
}

function parseColumnHeader(value) {
	const [title, formatter] = (value || '')
		.toString()
		.trim()
		.split(/\.{2}(?=\w+$)/)
	return [columnHeaderToObjectKey(title), formatter]
}

function column(value, index) {
	const [key, _formatterName] = parseColumnHeader(value)

	if (!key) {
		return
	}

	const isSpecial = key.startsWith('special.')
	const isRestricted = key === 'special.restrict'

	if (isSpecial && !isRestricted) {
		return
	}

	const { formatter, formatterName } = getFormatterFunction(_formatterName)

	return {
		key,
		index,
		formatterName,
		formatter,
		isRestricted,
	}
}

function columns(row) {
	const cols = row.map(column).filter(Boolean)

	// # Bertha legacy compatibility:
	// Rename duplicate columns keys, adding a number to the key
	// e.g if two cols are called "foo", the second (moving left-to-right in the sheet) would be "foo_2"
	// this includes columns with namespaces: the second "foo.bar" would become "foo.bar_2"
	Object.entries(groupBy(cols, 'key')).forEach(([, cols]) => {
		if (cols.length < 2) {
			return
		}

		if (cols[0].key.startsWith('special.')) {
			return
		}

		cols.slice(1).forEach((col, i) => {
			// This only works because we assume column keys don't
			// contain underscores. Otherwise we'd have to check
			// the new suffixed key isn't already in use on another column.
			col.key = `${col.key}_${i + 2}`
		})
	})

	return cols
}

module.exports = {
	columnHeaderToObjectKey,
	column,
	columns,
	getFormatterFunction,
	parseColumnHeader,
}
