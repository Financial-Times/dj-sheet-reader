// async function getSheet(client, spreadsheetId, sheetName, isOptional, signal) {
// throw if no spreadsheetId
// throw if no sheetName
// test error handling with google API response fixtures
// async function getSheets(client, spreadsheetId, sheets, transformSheet) {
// throw if no spreadsheetId
// throw id not sheets array
// test promise.all timeout
// test request cancelling
// mock getSheet and ensure its called as many times as there are sheets
// spy on transformSheet and ensure it's called with correct data

const { getSheet } = require('../sheets-api')
const { BadRequest } = require('http-errors')

test('getSheet with no spreadsheetId param', async () => {
	const client = {}
	const signal = {}
	await expect(getSheet(client, undefined, 'sheet name', false, signal)).rejects.toThrow(BadRequest)
})

test('getSheet with no sheetName param', async () => {
	const client = {}
	const signal = {}
	await expect(getSheet(client, 'theSpreadsheetId', undefined, false, signal)).rejects.toThrow(BadRequest)
})

test('getSheet with no client param', async () => {
	const client = {}
	const signal = {}
	await expect(getSheet(client, 'theSpreadsheetId', undefined, false, signal)).rejects.toThrow(BadRequest)
})
