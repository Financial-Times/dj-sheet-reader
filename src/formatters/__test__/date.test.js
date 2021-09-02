const { date, dateRange } = require('../date')

test.each([null, undefined, 0, false, ''])('falsy value %p becomes null', (value) => {
	expect(date(value)).toStrictEqual(null)
})

test.each([',', '  ', 'foo', 0.5, 'foo-bar-2019', '40-40-40-2019'])(
	'preserve original value %p when does not look like a date',
	(value) => {
		expect(date(value)).toStrictEqual(value)
	},
)

test.each([
	['01-01-2019', '2019-01-01T00:00:00.000Z'],
	['2019', '2019-01-01T00:00:00.000Z'],
	['01/02/2018', '2018-02-01T00:00:00.000Z'],
	['01/02/2018 12:15', '2018-02-01T12:15:00.000Z'],
])('return ISO date string when value %p looks like a date', (value, expected) => {
	expect(date(value)).toStrictEqual(expected)
})
