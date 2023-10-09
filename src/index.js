const { build } = require('./builder')
const { getSpreadsheetClient } = require('./sheets-api')

function SheetReader(options) {
	const {
		auth: { email, subject, key, scopes },
	} = options
	let client

	const api = {
		fetchSheet,
		fetchSheetWithCallback,
		refreshAuth,
	}

	function refreshAuth() {
		client = getSpreadsheetClient(email, subject, key, scopes)
		return api
	}

	function fetchSheet(spreadsheetId, sheetNames, options) {
		if (!client) {
			refreshAuth()
		}

		return build(client, spreadsheetId, sheetNames, options)
	}

	// Helper for legacy compatibility
	function fetchSheetWithCallback(spreadsheetId, sheetNames, options, callback) {
		fetchSheet(spreadsheetId, sheetNames, options)
			.then((data) => {
				callback(null, data)
			})
			.catch((error) => {
				callback(error)
			})
		return api
	}

	return api
}

module.exports = SheetReader
