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
			if(data){
				settings.from = data[0] || null
				settings.to = data[1] || null
			}
			return settings
		},
		(error) => settings
	)
}

module.exports = parseParams