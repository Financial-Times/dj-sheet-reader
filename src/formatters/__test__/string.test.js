const { str, string } = require('../string');

test.each([
	[null, ''],
	[undefined, ''],
	['', ''],
	['    ', '    '], // todo: legacy behavior: not correct, should be empty string
	[0, ''], // todo: legacy behavior: not correct, should be "0"
	[1, '1'],
	[true, 'true'],
	[false, ''], // todo: legacy behavior: not correct, should be "false"
])('%p is a string %p', (value, expected) => {
	expect(str(value)).toStrictEqual(expected);
	// todo: expect(str(value)).toBe(a string);
});

test('str is alias of string', () => {
	expect(str).toStrictEqual(string);
});