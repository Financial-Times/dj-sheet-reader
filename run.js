const { key, spreadsheetId, sheetNames } = require('./config');
const { createInstance } = require('./src/instance');

const SUBJECT = process.env.GOOGLE_USER;
const EMAIL = process.env.GOOGLE_CLIENT_EMAIL;
const KEY = process.env.GOOGLE_SERVICE_KEY || process.env.GOOGLE_KEY || key;

function main() {

	const instance = createInstance(EMAIL, SUBJECT, KEY);

	const options = {
		columnKeys: 'legacy',
	};

	instance.build(spreadsheetId, sheetNames, options, (error, data) => {
		if (error) {
			console.error(error);
			return;
		}

		console.log(data);
	});

}

// exec and print error
if (!module.parent) { (async function () {  main(); }()) }
// if (!module.parent) { (async function () { try { await main(); } catch (error) { console.error(error); } }()) }