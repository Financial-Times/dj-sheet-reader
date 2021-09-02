const program = require('commander')
const { key } = require('../config')
const SheetReader = require('./index')

program
	.option('-s, --spreadsheet <id>', 'Spreadsheet ID')
	.option('-h, --sheets <list>', 'Sheet names, comma delimited list')
	.option('-e, --auth-email', 'Google API service account email')
	.option('-x, --auth-subject', 'Google API subject user email')
	.option('-k, --auth-key', 'Google API key')

program.parse(process.argv)

const SUBJECT = process.env.GOOGLE_USER
const EMAIL = process.env.GOOGLE_CLIENT_EMAIL
const KEY = process.env.GOOGLE_SERVICE_KEY || process.env.GOOGLE_KEY || key

;(async () => {
	try {
		const options = {
			columnKeys: 'legacy',
		}

		const auth = {
			key: KEY,
			email: EMAIL,
			subject: SUBJECT,
		}

		const spreadsheetId = program.spreadsheet
		const sheetNames = program.sheets
			.split(/,/g)
			.map((s) => s.trim())
			.filter(Boolean)
		const data = await SheetReader({ auth }).fetchSheet(spreadsheetId, sheetNames, options)

		console.log(data)
	} catch (error) {
		console.error(error)
	}
})()
