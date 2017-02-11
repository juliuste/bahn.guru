'use strict'

const moment = require('moment-timezone')
const mdf = require('moment-duration-format')
const timezone = require('config').timezone
const api = require('../api')

const parseDate = (date) => {
	if(!date) return moment().tz(timezone).startOf('day')
	return moment(date, "DD.MM.YYYY").tz(timezone).startOf('day')
}

const parseParams = (params) => {
	// defaults and api-custom settings
	const settings = Object.assign({}, api.params(params))
	// date
	settings.date = parseDate(params.date)
	//stations
	return Promise.all([api.station(params.from), api.station(params.to)]).then(
		(data) => {
			if(!data || data.length!=2 || !data[0] || !data[1]) return {status: 'error', msg: 'Bitte geben Sie einen gültigen Start- und Zielbahnhof an.'}
			settings.from = data[0]
			settings.to = data[1]
			return {status: 'success', data: settings}
		},
		(error) => {
			return {status: 'error', msg: 'Bitte geben sie einen gültigen Start- und Zielbahnhof an.'}
		}
	)
}

module.exports = parseParams