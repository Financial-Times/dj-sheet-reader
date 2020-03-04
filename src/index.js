const createError = require('http-errors');
const { build } = require('./builder');
const { getSpreadsheetClient } = require('./sheets-api');

function SheetReader(options) {
	const { auth: {email, subject, key} } = options
	let client;

	const api = {
		fetchSheet,
		fetchSheetWithCallback,
		refreshAuth,
	}

	function refreshAuth() {
		client = getSpreadsheetClient(email, subject, key)
		return api;
	}

	async function fetchSheet(spreadsheetId, sheetNames, options) {
		if (!client) {
			refreshAuth()
		}

		try {
			const data = await build(client, spreadsheetId, sheetNames, options);	
			return data;
		} catch (error) {
			console.error(`Error: statusCode=${error.statusCode} message=${error.message}`)
			if (!error.statusCode) {
				throw createError(500, error, {expose: true})
			}
			throw error;
		}
	}

	// Helper to help with legacy compatibility
	function fetchSheetWithCallback(spreadsheetId, sheetNames, options, callback) {
		fetchSheet(spreadsheetId, sheetNames, options).then(data => {
			callback(null, data);
		}).catch(error => {
			callback(error);
		});
		return api;
	}
	
	return api;
}

module.exports = SheetReader;