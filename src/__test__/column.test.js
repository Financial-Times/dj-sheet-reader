const { columnHeaderToObjectKey, column, columns, getFormatterFunction } = require('../column');

test.each([
	[['a', 'b'], ['a', 'b']],
	[['A', 'B'], ['a', 'b']],
	[['foo', 'foo'], ['foo', 'foo_2']],
	[['foo', 'foo', 'foo'], ['foo', 'foo_2', 'foo_3']],
	[['foo..bool', 'foo..str'], ['foo', 'foo_2']],
	[['foo..bool', 'foo'], ['foo', 'foo_2']],
	[['a.b', 'a.b'], ['a.b', 'a.b_2']],
	[['a.b.c', 'a.b.c'], ['a.b.c', 'a.b.c_2']],
	[['a', '', 'b'], ['a', 'b']],
	[['1', '111', 'a1b', 'a1'], ['a1b', 'a1']],
	[[1, 2, 3], []],
	[['', '', ''], []],
	[['', null, '', null], []],
	[['a', 'special.&', '', 'special.foo', 'special.restrict', '!&'], ['a', 'special.restrict']],
])('columns(%p) returns %p', (value, expected) => {
	const result = columns(value);
	const keys = result.map(c => c.key);
	expect(keys).toStrictEqual(expected);
});
test('keeps correct index when removing invalid columns', () => {
	const result = columns(['a', '', 'b', null, 'c', '_', 'd', 'special.', 'e', 'special.foo']);
	const indexs = result.map(c => c.index);
	expect(indexs).toStrictEqual([0, 2, 4, 6, 8]);
});

test('keeps special.restrict column', () => {
	const result = columns(['a', 'special.restrict', 'b', 'c']);
	const keys = result.map(c => c.key);
	expect(keys).toHaveLength(result.length);
	expect(keys).toEqual(expect.arrayContaining(['special.restrict']));
});

// todo: what happens when there are 2 "special.restrict" columns?

test('remove "special." columns (except special.restrict)', () => {
	const result = columns(['a', 'special.restrict', 'b', 'special.', 'special.&', '.special.']);
	const keys = result.map(c => c.key);
	expect(keys).toEqual(['a', 'special.restrict', 'b']);
});

test('remove invalid columns', () => {
	const result = columns(['a', '_', 'b', '.', '..', 'c', '%$!']);
	const keys = result.map(c => c.key);
	expect(keys).toEqual(['a', 'b', 'c']);
});

test('column', () => {
	const result = column('a', 5);
	const expected = {
		key: 'a',
		index: 5,
		isRestricted: false,
	};
	expect(result).toMatchObject(expected);
});

test('special.restrict column', () => {
	const result = column('special.restrict', 3);
	const expected = {
		key: 'special.restrict',
		index: 3,
		isRestricted: true,
	};
	expect(result).toMatchObject(expected);
});



test('formatter name', () => {
	const result = column('some column..bool', 3);
	const expected = {
		key: 'somecolumn',
		index: 3,
		formatterName: 'bool',
	};
	expect(result).toMatchObject(expected);
});

test('empty formatter name', () => {
	const result = column('some column..', 3);
	const expected = {
		key: 'somecolumn',
		formatterName: 'basic',
	};
	expect(result).toMatchObject(expected);
});

test('no formatter name', () => {
	const result = column('some column', 0);
	const expected = {
		key: 'somecolumn',
		formatterName: 'basic',
	};
	expect(result).toMatchObject(expected);
});

test.each([
	null, '', ' ', ' - ', '_', ' \n ', '.', ' . ', ' .. ', '?', '$%^&', ', '
])('column header cells with no valid characters are invalid for processing : "%p"', (value) => {
	expect(column(value)).toBeUndefined()
});

test.each([
	'special.something', 'special.$ ', ' special.',
	'SPECIAL.SOMETHING', '.special..', 'special...bool', 'special.foo..bool'
])('special columns are invalid for processing : "%p"', (value) => {
	expect(column(value)).toBeUndefined()
});

test('formatter name with too many dots', () => {
	const result = column('some column...bool', 0);
	const expected = {
		key: 'somecolumn',
		formatterName: 'bool',
	};
	expect(result).toMatchObject(expected);
});

test.each([
	['  ', ''],
	[' A ', 'a'],
	['a.b', 'a.b'],
	[' a. b', 'a.b'],
	['a.b.c', 'a.b.c'],
	['a..bool', 'a..bool'],
	['a...bool', 'a...bool'],
	[' Foo Bar ', 'foobar'],
	['FOO BAR', 'foobar'],
	['foo-bar ', 'foobar'],
	['foo_bar ', 'foobar'],
	['fooBar', 'foobar'],
	['foo\nBar', 'foobar'],
	['foo\t\tBar', 'foobar'],
	['.', ''],
	[' . ', ''],
	['..', ''],
	[' .. ', ''],
	['...', ''],
	['foo.', 'foo'],
	['.foo', 'foo'],
	[' .foo', 'foo'],
	[' .foo. ', 'foo'],
	[' ..foo ', 'foo'],
	['...foo ', 'foo'],
	[1, ''], // number
	[100, ''], // number
	['9', ''], // string single digit character
	['999', ''], // string is all digits
	['9foo', 'foo'], // starts with single digit character
	['111foo', 'foo'], // starts with digits
	['foo1foo', 'foo1foo'], // contains digit
	['foo111foo', 'foo111foo'], // contains digits
	['foo111', 'foo111'], // ends with digits
	['?foo', 'foo'],
	[',foo', 'foo'],
	['a;b:c,d"e!f£g`h+i=j{k(l)m%n^o*p@q', 'abcdefghijklmnopq'],
	['special.restrict', 'special.restrict'],
	['special.', 'special.'],
	['special.foo', 'special.foo'],
	['special.&', 'special.'],
	['!special.&', 'special.'],
	['special. ', 'special.'],
	[' SPECIAL.foo', 'special.foo'],
	[undefined, ''],
	[null, ''],
	['', ''],
	[0, ''],
])('columnHeaderToObjectKey(%p) returns %p', (value, expected) => {
	expect(columnHeaderToObjectKey(value)).toStrictEqual(expected);
});

test('columnHeaderToObjectKey() with no args', () => {
	expect(columnHeaderToObjectKey()).toStrictEqual('');
});

