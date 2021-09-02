const { prepareSheetData, prepareSpreadsheetData } = require('../prepare')
// jest.mock('../formatters/all');
const formatters = require('../formatters/all')

test.each([
	[
		[
			//in
			['a'],
			['1'],
		],
		[
			// out
			{ a: 1 },
		],
	],
	[
		[
			// in
			['a', 'b'],
			['1', 'a string'],
			['another string', null],
		],
		[
			// out
			{ a: 1, b: 'a string' },
			{ a: 'another string', b: null },
		],
	],
	[
		[
			// in
			['a.b', 'a.c.d'],
			['1', 'a string'],
		],
		[
			// out
			{ a: { b: 1, c: { d: 'a string' } } },
		],
	],
	[
		[
			// in
			['a', 'a.b'],
			['A', 'A.B'],
		],
		[
			// out
			{ a: { b: 'A.B' } },
		],
	],
	[
		[
			// in
			['a.b', 'a'],
			['A.B', 'A'],
		],
		[
			// out
			{ a: 'A' },
		],
	],
	[
		[
			// in
			['a', 'a'],
			['A1', 'A2'],
		],
		[
			// out
			{ a: 'A1', a_2: 'A2' },
		],
	],
	[
		[
			// in
			['a', 'a', 'a.b'],
			['A1', 'A2', 'A.B'],
		],
		[
			// out
			{ a_2: 'A2', a: { b: 'A.B' } },
		],
	],
	[
		[
			// in
			['', 'a'],
			['1', '2'],
		],
		[
			// out
			{ a: 2 },
		],
	],
	[
		[
			// in
			['a', '_', 'b', '!', 'c', 'special.@'],
			['A', '_', 'B', '!', 'C', '@'],
		],
		[
			// out
			{ a: 'A', b: 'B', c: 'C' },
		],
	],
	[
		[
			// in
			['!-a-!', 'b'],
			['A', 'B'],
		],
		[
			// out
			{ 'a-': 'A', b: 'B' },
		],
	],
	[
		[
			// in
			[''],
			[''],
		],
		[
			/* out: empty array */
		],
	],
	[
		[
			// in
			['', '-'],
			['A', 'B'],
		],
		[
			/* out: empty array */
		],
	],
])('prepareSheetData test %#: columns(%j) returns %p', (input, expected) => {
	const output = prepareSheetData(input)
	expect(output).toStrictEqual(expected)
})

test('prepareSheetData with only a header row', () => {
	const input = [['a', 'b', 'c']]
	const output = prepareSheetData(input)
	expect(output).toStrictEqual([])
})

test('prepareSheetData with only a header row', () => {
	const input = [['a'], ['1']]
	const spy = jest.spyOn(formatters, 'basic')
	prepareSheetData(input)
	expect(spy).toHaveBeenCalledTimes(1)
	expect(spy).toHaveBeenCalledWith('1')
})

test('prepareSheetData with empty sheet', () => {
	expect(prepareSheetData([])).toStrictEqual([])
})

test('prepareSheetData with no args', () => {
	expect(prepareSheetData).toThrow()
})

test('prepareSheetData with no args', () => {
	expect(prepareSpreadsheetData).toThrow()
})
