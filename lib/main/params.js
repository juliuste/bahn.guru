'use strict'

const api = require('../api')

const parseParams = (params) => {
	// defaults and api-custom settings
	const settings = Object.assign({weeks: 4}, api.params(params))
	// weeks
	if(+params.weeks && +params.weeks<=12 && +params.weeks>0) settings.weeks = +params.weeks
	if(params.error){
		if(params.error==='noResults') return Promise.resolve(Object.assign(settings, {error: 'Leider wurden für Ihre Anfrage keine Verbindungen gefunden.'}))
		if(params.error==='noStations') return Promise.resolve(Object.assign(settings, {error: 'Bitte geben Sie einen gültigen Start- und Zielbahnhof an'}))
		else return Promise.resolve(Object.assign(settings, {error: 'Unbekannter Fehler. Bitte versuchen Sie es erneut oder kontaktieren Sie uns.'}))
	}
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
