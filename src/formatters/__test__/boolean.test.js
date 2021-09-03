const { bool, boolean, _bool } = require('../boolean')

test.each(['y', 'yes', 'true', 'Y', 'YES', 'TRUE', ' yEs', ' tRuE '])('%p converts to true', (value) => {
	expect(_bool(value)).toStrictEqual(true)
	expect(bool(value)).toStrictEqual(true)
})

test.each(['n', 'no', 'false', 'N', 'NO', 'FALSE', ' No', ' fAlsE '])('%p converts to false', (value) => {
	expect(_bool(value)).toStrictEqual(false)
	expect(bool(value)).toStrictEqual(false)
})

test.each(['', '  ', '0', '1', 'foo', ' bar ', null, undefined, [], {}])('unrecognised value %p', (value) => {
	expect(_bool(value)).toStrictEqual(undefined)
	expect(bool(value)).toStrictEqual(false)
})

test('when passed 0 or 1', () => {
	expect(_bool(0)).toStrictEqual(undefined)
	expect(_bool(1)).toStrictEqual(undefined)
	expect(bool(0)).toStrictEqual(false)
	expect(bool(1)).toStrictEqual(true)
})

test('when passed a boolean value as an argument', () => {
	expect(_bool(false)).toStrictEqual(undefined)
	expect(_bool(true)).toStrictEqual(undefined)
	expect(bool(false)).toStrictEqual(false)
	expect(bool(true)).toStrictEqual(true)
})

test('with no args', () => {
	expect(_bool()).toStrictEqual(undefined)
	expect(bool()).toStrictEqual(false)
})

test('bool is alias of boolean', () => {
	expect(bool).toStrictEqual(boolean)
})
