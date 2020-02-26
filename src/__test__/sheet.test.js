const { isRestricted } = require('../sheet');

test.each([null, undefined, '', '   ', 'false', 'no', 'NO', 'N', 'n', ' n ', '0', 0, 'foo bar'])('is not restricted when cell value is %p', (value) => {
	expect(isRestricted(value)).toBe(false);
});

test.each(['TRUE', ' true ', ' Y', ' YES ', ' ok ', ' on ', 'oN'])('restricted when cell value is %p', (value) => {
	expect(isRestricted(value)).toBe(true);
});

test('not restricted when no args', () => {
	expect(isRestricted()).toBe(false);
});
