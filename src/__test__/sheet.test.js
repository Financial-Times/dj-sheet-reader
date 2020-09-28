const { isRestricted, sheetKey, sheetDetails, sheet } = require('../sheet');

test('sheet with only one row', () => {
	const rawData = [
		['a', 'b']
	]
	const result = sheet(rawData)
	expect(result.columns).toHaveLength(2)
	expect(result.columns).toHaveLength(2)
	expect(result.rows).toHaveLength(0)
})

test('sheet with two rows', () => {
	const rawData = [
		['a', 'b'],
		['1', '1']
	]
	const result = sheet(rawData)
	expect(result.columns).toHaveLength(2)
	expect(result.rows).toHaveLength(1)
	expect(result.rows[0]).toStrictEqual(['1', '1'])
})

test('sheet one cell', () => {
	const rawData = [
		['a'],
	]
	const result = sheet(rawData)
	expect(result.columns).toHaveLength(1)
	expect(result.rows).toHaveLength(0)
})

test('sheet one cell that is not a valid column name', () => {
	const rawData = [
		['111'],
	]
	const result = sheet(rawData)
	expect(result.columns).toHaveLength(0)
	expect(result.rows).toHaveLength(0)
})

test('sheet with sparse header row', () => {
	const rawData = [
		['a', '', '-', 'b', '_', ' .. ', '.!'],
		['1', '1', '1', '1', '1', '1', '1'],
		['1', '1', '1', '1', '1', '1', '1'],
	]
	const result = sheet(rawData)
	expect(result.columns).toHaveLength(2)
	expect(result.columns[1].index).toBe(3)
	expect(result.rows).toHaveLength(2)
	expect(result.rows[0]).toHaveLength(7)
})

test('empty sheet', () => {
	expect(sheet([])).toStrictEqual({columns:[], rows: []})
})

test('sheet with special.restrict column has data filtered out', () => {
	const rawData = [
		['heading', 'special.restrict'],
		['A', ''],
		['B', 'no'],
		['C', 'n'],
		['D', 'false'],
		['E', 'some string'],
		['F', 'true'],
		['G', 'yes'],
		['H', 'y'],
	]
	const result = sheet(rawData)
	expect(result.columns).toHaveLength(1)
	expect(result.rows).toHaveLength(5)
	// expect(result.rows[0]).toStrictEqual(['no', 'E', ''])
	// expect(result.rows[1]).toStrictEqual(['no', 'F', 'no'])
	// expect(result.rows[2]).toStrictEqual(['', 'G', ''])
})

test('sheet with special column has columns filtered out, but values remain', () => {
	const rawData = [
		['heading', 'special.something'],
		['1', '1'],
		['1', '1'],
		['1', '1'],
		['1', '1'],
	]
	const result = sheet(rawData)
	expect(result.columns).toHaveLength(1)
	expect(result.rows).toHaveLength(4)
	expect(result.rows[0]).toHaveLength(2)
})

test('sheet with special column has columns filtered out, but values remain', () => {
	const rawData = [
		['heading', 'special.something', 'special.restrict'],
		['A', 'Row 1', ''],
		['B', 'Restricted row', 'y'],
		['C', 'Row 2', ''],
		['D', 'Restricted row', 'ok'],
	]
	const result = sheet(rawData)
	expect(result.columns).toHaveLength(1)
	expect(result.rows).toHaveLength(2)
	expect(result.rows[0]).toStrictEqual(['A', 'Row 1', undefined])
	expect(result.rows[1]).toStrictEqual(['C', 'Row 2', undefined])
})

test('When there are two special.restrict columns, both are used', () => {
	const rawData = [
		['special.restrict', 'heading', 'special.restrict'],
		['no',	'A', ''],
		['no',	'B', 'no'],
		['', 		'C', ''],
		['some string', 'D', ''],
		['yes',	'E', 'yes'],
		['yes',	'F', ''],
		['',		'G', 'yes'],
		['no',	'H', 'yes'],
		['some string',	'I', 'yes'],
	]
	const result = sheet(rawData)

	expect(result.columns).toHaveLength(1)
	expect(result.columns[0].key).toStrictEqual('heading')
	expect(result.columns[0].index).toStrictEqual(1)

	expect(result.rows).toHaveLength(4)
	expect(result.rows[0]).toStrictEqual([undefined, 'A', undefined])
	expect(result.rows[1]).toStrictEqual([undefined, 'B', undefined])
	expect(result.rows[2]).toStrictEqual([undefined, 'C', undefined])
	expect(result.rows[3]).toStrictEqual([undefined, 'D', undefined])
})

// spy sheetKey ensure it doesn't get the plus sign

test.each([
	['a', 'a'],
	['Sheet One', 'Sheet One'],
	['+a', 'a'],
	['+A', 'A'],
	['++a', '+a'],
	['-a', '-a'],
	['?a', '?a'],
])('sheetDetails(%p).sheetName === %p', (value, expected) => {
	expect(sheetDetails(value).sheetName).toStrictEqual(expected)
})

test.each([
	[' Sheet One ', ' Sheet One '],
	['+a', 'a'],
	['++a', '+a'],
	['+ A', ' A'],
	[' +A ', ' +A '],
])('sheetDetails(%p).key === %p', (value, expected) => {
	expect(sheetDetails(value).key).toStrictEqual(expected)
})

test.each([
	['a', false],
	[' Sheet One ', false],
	['+a', true],
	['++a', true],
	['+ A', true],
	[' +A ', false],
])('sheetDetails(%p).optional === %p', (value, expected) => {
	expect(sheetDetails(value).optional).toStrictEqual(expected)
})

test.each([
	null, undefined, '', '   ', 'false', 'no', 'NO', 'N', 'n', ' n ', '0', 0, 'foo bar'
])('is not restricted when cell value is %p', (value) => {
	expect(isRestricted(value)).toBe(false);
});

test.each([
	'TRUE', ' true ', ' Y', ' YES ', ' ok ', ' on ', 'oN'
])('restricted when cell value is %p', (value) => {
	expect(isRestricted(value)).toBe(true);
});

test('not restricted when no args', () => {
	expect(isRestricted()).toBe(false);
});

test.each([
	['a', 'a'],
	['A', 'A'],
	['One Two', 'One Two'],
	[' One Two ', ' One Two '],
	[100, '100'],
	[null, ''],
	[undefined, ''],
])('sheetKey(%p) === %p', (value, expected) => {
	expect(sheetKey(value)).toStrictEqual(expected);
});

test('sheetKey empty string when no args', () => {
	expect(sheetKey()).toStrictEqual('');
});
