const { basic } = require('../basic')

test.each([
	['100', 100],
	['1.5', 1.5],
	['.5', 0.5],
	['1e5', 1e5],
	['1,000', 1000],
	['1,000,000', 1000000],
	['1,000,000.99', 1000000.99],
])('number string %p to number %p', (value, expected) => {
	expect(basic(value)).toStrictEqual(expected)
})

test.each([
	['foo', 'foo'],
	[' foo ', 'foo'],
	[' foo', 'foo'],
	['foo ', 'foo'],
	['-', '-'],
	[' -/ ', '-/'],
	['0,foo', '0,foo'],
	['0.foo', '0.foo'],
])('trims string value %p', (value, expected) => {
	expect(basic(value)).toStrictEqual(expected)
})

test.each(['y', 'yes', 'true', 'Y', 'YES', 'TRUE', ' yEs', ' tRuE '])('converts %p to boolean true', (value) => {
	expect(basic(value)).toStrictEqual(true)
})

test.each(['n', 'no', 'false', 'N', 'NO', 'FALSE', ' No', ' fAlsE '])('converts %p to boolean false', (value) => {
	expect(basic(value)).toStrictEqual(false)
})

test('with no args', () => {
	expect(basic()).toBeNull()
})

test('empty string', () => {
	expect(basic('')).toBeNull()
})

test('"null" string', () => {
	expect(basic('null')).toBeNull()
})

test('whitespace string', () => {
	expect(basic('    ')).toBeNull()
})
