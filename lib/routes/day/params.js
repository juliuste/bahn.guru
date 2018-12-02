'use strict'

const moment = require('moment-timezone')
// eslint-disable-next-line no-unused-vars
const mdf = require('moment-duration-format')

const parseDate = (date, timezone) => {
	if (!date) return moment().tz(timezone).startOf('day')
	return moment(date, 'DD.MM.YYYY').tz(timezone).startOf('day')
}

const createParseParams = api => params => {
	// defaults and api-custom settings
	const settings = Object.assign({}, api.params(params))
	// date
	settings.date = parseDate(params.date, api.settings.timezone)
	// stations
	return Promise.all([api.station(params.origin), api.station(params.destination)])
		.then(
			(data) => {
				if (!data || data.length !== 2 || !data[0] || !data[1]) return { status: 'error', msg: 'Bitte geben Sie einen gültigen Start- und Zielbahnhof an.' }
				settings.origin = data[0]
				settings.destination = data[1]
				return { status: 'success', data: settings }
			}
		).catch(
		// eslint-disable-next-line handle-callback-err
			(error) => {
				return { status: 'error', msg: 'Bitte geben sie einen gültigen Start- und Zielbahnhof an.' }
			}
		)
}

module.exports = createParseParams
