'use strict'

const api = require('../api')

const parseParams = (params) => {
	// defaults and api-custom settings
	const settings = Object.assign({weeks: 4}, api.params(params))
	// weeks
	if(+params.weeks && +params.weeks<=12 && +params.weeks>0) settings.weeks = +params.weeks
	// stations
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