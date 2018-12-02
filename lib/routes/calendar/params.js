'use strict'

const merge = require('lodash/merge')

const createParseParams = api => params => {
	// defaults and api-custom settings
	const settings = merge({ weeks: 4 }, api.params(params))
	// weeks
	if (+params.weeks && +params.weeks <= 12 && +params.weeks > 0) settings.weeks = +params.weeks
	// stations
	return Promise.all([api.station(params.origin), api.station(params.destination)])
		.then(data => {
			if (!data || data.length !== 2 || !data[0] || !data[1]) return { status: 'error', msg: 'Bitte geben Sie einen gültigen Start- und Zielbahnhof an.' }
			settings.origin = data[0]
			settings.destination = data[1]
			return { status: 'success', data: settings }
		})
		// eslint-disable-next-line handle-callback-err
		.catch(error => ({ status: 'error', msg: 'Bitte geben sie einen gültigen Start- und Zielbahnhof an.' }))
}

module.exports = createParseParams