# dj-sheet-reader

![Node.js CI](https://github.com/Financial-Times/dj-sheet-reader/workflows/Node.js%20CI/badge.svg)

> Provides the core spreadsheet processing functionality inside [Bertha](https://github.com/ft-interactive/bertha).

## What does it do?

- Fetches data from a google spreadsheet
- transforms all the cells values to types (eg booleans, numbers and arrays)
- outputs the result as an object.

[Bertha](https://github.com/ft-interactive/bertha) wraps this functionality into a service, providing also a cache and a background queue for that helps managing large spreadsheets and frequent edits.

## Installation

    $ npm install @financial-times/sheet-reader

## Usage

First, you'll need a Google API Service Account email and key. A service account reads/writes data from the Google API on behalf Google user/email: this is known as the "subject" account.

```js
const SheetReader = require('@financial-times/sheet-reader')

const auth = {
	key: process.env.KEY,
	email: process.env.EMAIL,
	subject: process.env.SUBJECT,
}

const spreadsheetId = '__your__sheet__id__'
const sheetNames = ['Sheet1', '+my Optional Sheet']

const data = await SheetReader({ auth }).fetchSheet(spreadsheetId, sheetNames)

process.stdout.write(JSON.stringify(data))
```

## API

**`SheetReader(options: object):SheetReaderInstance`**

`options`:

- `auth.email`: is the Email/ID of the service account
- `auth.key`: is a key that's generated for the service account that's used authenticate with the Google API
- `auth.subject`: a Google Email account (e.g a person or email group) who is the subject of the API request and is used for authorisation. This library can only fetch the data for a spreadsheet if the subject has read access.

**`fetchSheet(spreadsheetId: string, sheetNames: string[], options: object):Promise<object>`**

- `spreadsheetId`: The ID of the Google Spreadsheet
- `sheetNames`: An array of sheet names (as they appear on the tabbed sheets)
  - It's possible for sheets to be optional
- `options`
  - reserved for future use.

**`fetchSheetWithCallback(spreadsheetId: string, sheetNames: string[], options: object, callback: Function(error, data)):SheetReaderInstance`**

Same as `fetchSheet` but uses the older callback pattern, rather than returning a promise.

```js
SheetReader({ auth }).fetchSheet(spreadsheetId, sheetNames, {}, function (error, data) {
	if (error) {
		console.error(error)
		return
	}
	process.stdout.write(JSON.stringify(data))
})
```

**`refreshAuth():void`**

Refreshes the JWT token in case it's expired.

## Licence

This software is published by the Financial Times under the [MIT licence](http://opensource.org/licenses/MIT).
