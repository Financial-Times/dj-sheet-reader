const { BadRequest } = require('http-errors')
const { build } = require('../builder')

test('throw when no client param', async () => {
	await expect(build(undefined, 'theSpreadsheetId', ['sheet-names'], {})).rejects.toThrow(Error)
})

test('throw when no sheetNames array', async () => {
	const client = {}
	await expect(build(client, 'theSpreadsheetId', undefined, {})).rejects.toThrow(Error)
})

test('throw when no spreadsheetId param', async () => {
	const client = {}
	await expect(build(client, undefined, ['sheet name'], {})).rejects.toThrow(BadRequest)
})
// throws when any of the args are missing
// and there's alsways a statusCode

// mock getSheets to return predictable data
// mock sheetDetails to return predicatbale data. ensure it's called once per sheetName
