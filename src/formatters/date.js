const moment = require('moment')

function date(val) {
	if (!val) {
		return null
	}

	var t = val.toString().replace(/[\/\\]/g, '-')
	var notDayMonthYearFormatted = !/^\d{2}\-\d{2}\-\d{4}/.test(t)

	if (notDayMonthYearFormatted) {
		var parts = t.split(/\-/g)
		var isTwoDigits = /^\d{2}$/
		var isFourDigits = /^\d{4}$/
		var startsWithYear = isFourDigits.test(parts[0])
		var thenHasTwoDigitNumber = isTwoDigits.test(parts[1])
		var followedByAnotherTwoDigitNumber = isTwoDigits.test(parts[2])

		if (startsWithYear && thenHasTwoDigitNumber && followedByAnotherTwoDigitNumber) {
			parts = [parts[2], parts[1], parts[0]].concat(parts.slice(3))
		} else if (startsWithYear && thenHasTwoDigitNumber) {
			parts = [parts[1], parts[0]].concat(parts.slice(2))
		} else {
		}

		t = parts.join('-')
		var hyphens = (t.match(/\-/g) || []).length

		if (hyphens === 0 && isFourDigits.test(parts[0])) {
			t = '01-01-' + t
		} else if (hyphens === 1 && isTwoDigits.test(parts[0])) {
			t = '01-' + t
		} else if (hyphens === 0 && /^\d{2}\:\d{2}/.test(parts[0])) {
			t = '01-01-1970 ' + t
		}
	}

	t += t.search(/\ \d{2}\:\d{2}/) === -1 ? ' 00:00' : ''
	t += t.search(/(\-|\+)[\d\:]{4,5}$/) === -1 ? ' +0000' : ''

	var d = moment(t, 'DD-MM-YYYY HH:mm Z')

	if (d.isValid()) {
		return d.utc().toDate().toISOString()
	}

	return val
}

function dateRange(val) {
	var arr

	if (!val || !(arr = val.split(/[,\n\r][\ \n\r]*/g)).length) {
		return []
	}

	return [date(arr[0]), date(arr[1])]
}

module.exports = {
	date,
	dateRange,
}
