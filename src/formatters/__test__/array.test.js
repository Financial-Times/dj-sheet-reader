const { array, arr, li, list } = require('../array');

test.each([
	['a,b,c', ['a', 'b', 'c']],
	[' a , b , c ', ['a', 'b', 'c']],
	['a,,c', ['a', null, 'c']],
	['a', ['a']],
	['', []],
	[',,', [null,null,null]],
	['foo,1,true,100,false,', ['foo', 1, true, 100, false, null]],
])('%p to array', (value, expected) => {
	expect(list(value)).toStrictEqual(expected);
});

test('arr is alias of array function', () => {
	expect(arr).toStrictEqual(array);
});

test('li is alias of list function', () => {
	expect(li).toStrictEqual(list);
});
