const SheetReader = require('./src')

async function main() {
	const options = {
		columnKeys: 'legacy',
	}

	const auth = {
		key: process.env.GOOGLE_SERVICE_KEY,
		email: process.env.GOOGLE_CLIENT_EMAIL,
		subject: process.env.GOOGLE_USER,
		scopes: process.env.GOOGLE_CLIENT_SCOPES.split(/,\s*/g),
	}

	const spreadsheetId = process.env.spreadsheetId
	const sheetNames = process.env.sheetNames.split(/,\s*/g)

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
