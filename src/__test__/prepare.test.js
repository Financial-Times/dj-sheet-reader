const { prepareSheetData, prepareSpreadsheetData } = require('../prepare');
// jest.mock('../formatters/all');
const formatters = require('../formatters/all');

test.only.each([
	[
		[ //in
			['a'],
			['1'],
		],
		[ // out
			{a: 1}
		]
	],
	[
		[ // in
			['a', 'b'],
			['1', 'a string'],
			['another string', null],
		],
		[ // out
			{a: 1, b: 'a string'},
			{a: 'another string', b: null},
		]
	],
	[
		[ // in
			['a.b', 'a.c.d'],
			['1', 'a string'],
		],
		[ // out
			{a: {b: 1, c: {d: 'a string'}}},
		]
	],
	[
		[ // in
			['a', 'a.b'],
			['A', 'A.B']
		],
		[ // out
			{a: {b: 'A.B'}}
		]
	],
	[
		[ // in
			['a.b', 'a'],
			['A.B', 'A']
		],
		[ // out
			{a: 'A'}
		]
	],
	[
		[ // in
			['a', 'a'],
			['A1', 'A2']
		],
		[ // out
			{a: 'A1', a_2: 'A2'}
		]
	],
	[
		[ // in
			['a', 'a', 'a.b'],
			['A1', 'A2', 'A.B'],
		],
		[ // out
			{a_2: 'A2', a:{b: 'A.B'}}
		]
	],

	// Option 1:
	// Current behaviour:
	// Using integers as property names produces an Array.
	// If index numbers are missing this produces a sparse Array with undefined values.
	[
		[ // in
			['a.0', 'a.1', 'a.2'],
			['A0', 'A1', 'A2'],
		],
		[ // out
			{a: ['A0', 'A1', 'A2']}
		]
	],
	[
		[ // in
			['a.1', 'a.2', 'a.3'],
			['A1', 'A2', 'A3'],
		],
		[ // out
			{a: [undefined, 'A1', 'A2', 'A3']}
		]
	],
	[
		[ // in
			['a.0', 'a.2', 'a.3'],
			['A0', 'A2', 'A3'],
		],
		[ // out
			{a: ['A0', undefined, 'A2', 'A3']}
		]
	],

	// Property names are a mix of integers and strings
	// When the string is the first property to be defined we get an object!!
	[
		[ // in
			['a.b', 'a.0', 'a.1'],
			['AB', 'A0', 'A1'],
		],
		[ // out
			{a: {b: 'AB', 0: 'A0', 1: 'A1'}}
		],
		'Property names are a mix of integers and strings. Define a string first (i.e. the a.b is the first column)'
	],

	// Property names are a mix of integers and strings
	// Jest has an issue with the test below. See: https://github.com/facebook/jest/issues/8475
	// [
	// 	[ // in
	// 		['a.0', 'a.b', 'a.1'],
	// 		['A0', 'AB', 'A1'],
	// 	],
	// 	[ // out
	// 		{a: ['A0', 'A1']}
	// 	],
	// 	'Property names are a mix of integers and strings. Defines and interger first. The first column on the left is a.0'
	// ],

	// ENDS

	// Option 2
	// Potential original Bertha behaviour
	// Using integers as property names produces an object.
	// Should have no problem with sparse arrays or a mix of strings and integers.

	/*
	
	[
		[ // in
			['a.0', 'a.1', 'a.2'],
			['A0', 'A1', 'A2'],
		],
		[ // out
			{a: {'0': 'A0', '1': 'A1', '2': 'A2'}}
		]
	],
	[
		[ // in
			['a.1', 'a.2', 'a.3'],
			['A1', 'A2', 'A3'],
		],
		[ // out
			{a: {'1': 'A1', '2': 'A2', '3': 'A3'}}
		]
	],
	[
		[ // in
			['a.0', 'a.2', 'a.3'],
			['A0', 'A2', 'A3'],
		],
		[ // out
			{a: {'0': 'A0', '2': 'A2', '3': 'A3'}}
		]
	],
	[
		[ // in
			['a.0', 'a.b', 'a.1'],
			['A0', 'AB', 'A1'],
		],
		[ // out
			{a: ['A0', 'A1']}
		],
		'Property names are a mix of integers and strings. Defines and interger first. The first column on the left is a.0',
	],
		[
		[ // in
			['a.b', 'a.0', 'a.1'],
			['AB', 'A0', 'A1'],
		],
		[ // out
			{a: {b: 'AB', 0: 'A0', 1: 'A1'}}
		],
		'Property names are a mix of integers and strings. Define a string first (i.e. the a.b is the first column)',
	],

	*/
// ENDS

	[
		[ // in
			['', 'a'],
			['1', '2']
		],
		[ // out
			{a: 2}
		]
	],
	[
		[ // in
			['a', '_', 'b', '!', 'c', 'special.@'],
			['A', '_', 'B', '!', 'C', '@']
		],
		[ // out
			{ a: 'A', b: 'B', c: 'C' }
		]
	],
	[
		[ // in
			['!-a-!', 'b'],
			['A', 'B']
		],
		[ // out
			{ 'a-': 'A', b: 'B' }
		]
	],
	[
		[ // in
			[''],
			['']
		],
		[/* out: empty array */],
	],
	[
		[ // in
			['', '-'],
			['A', 'B'],
		],
		[/* out: empty array */],
	]
])('prepareSheetData test %#: columns(%j) returns %p', (input, expected) => {
	const output = prepareSheetData(input)
	expect(output).toStrictEqual(expected);
});

test('prepareSheetData with only a header row', () => {
	const input = [
		['a', 'b', 'c'],
	]
	const output = prepareSheetData(input)
	expect(output).toStrictEqual([]);
});


test('prepareSheetData with only a header row', () => {
	const input = [
		['a'],
		['1']
	]
	const spy = jest.spyOn(formatters, 'basic')
	const output = prepareSheetData(input);
	expect(spy).toHaveBeenCalledTimes(1);
	expect(spy).toHaveBeenCalledWith('1');
});



test('prepareSheetData with empty sheet', () => {
	expect(prepareSheetData([])).toStrictEqual([]);
});

test('prepareSheetData with no args', () => {
	expect(prepareSheetData).toThrow();
});

test('prepareSheetData with no args', () => {
	expect(prepareSpreadsheetData).toThrow();
});