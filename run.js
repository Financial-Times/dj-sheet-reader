const { key, spreadsheetId, sheetNames } = require('./config')
const SheetReader = require('./src')

const SUBJECT = process.env.GOOGLE_USER
const EMAIL = process.env.GOOGLE_CLIENT_EMAIL
const KEY = process.env.GOOGLE_SERVICE_KEY || process.env.GOOGLE_KEY || key

async function main() {
	const options = {
		columnKeys: 'legacy',
	}

	const auth = {
		key: KEY,
		email: EMAIL,
		subject: SUBJECT,
	}

	const data = await SheetReader({ auth }).fetchSheet(spreadsheetId, sheetNames, options)

	console.log(data)
}

// exec and print error
if (!module.parent) {
	;(async function () {
		try {
			await main()
		} catch (error) {
			console.error(error)
		}
	})()
}
