const { build } = require('./builder');
const { getSpreadsheetClient } = require('./sheets-api');

function createInstance(email, subject, key) {

	const instance = {};

	instance.client = getSpreadsheetClient(email, subject, key);

	// todo: handle expired token and retry
	instance.refreshToken = function() {};

	instance.build = function (spreadsheetId, sheetNames, options, callback) {
		build(instance.client, spreadsheetId, sheetNames, options).then(data => {
			callback(null, data);
		}).catch(error => {
			callback(error);
		});
	};

	return instance;
}

module.exports = {
	createInstance,
};