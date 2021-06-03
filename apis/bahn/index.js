'use strict'

const pick = require('lodash/pick')

const params = require('./lib/params')
const options = require('./lib/options')
const station = require('./lib/station')
const journeys = require('./lib/journeys')
const settings = require('./settings')

const shopLink = (origin, destination, date, journey, params) => {
	const shortenedJourney = pick(journey, ['type', 'id', 'price'])
	const newLegs = []
	for (const leg of journey.legs) {
		const newLeg = pick(leg, ['origin', 'destination', 'departure', 'arrival', 'line'])
		newLeg.line = pick(leg.line, ['type', 'name'])
		newLegs.push(newLeg)
	}
	shortenedJourney.legs = newLegs

	// process.stdout.write(JSON.stringify(shortenedJourney)+"\n\n")

	let bahncard = params.bc
	if (params.class === 1) {
		if (params.bc === 2) bahncard = 1
		if (params.bc === 4) bahncard = 3
	}

	return `https://link.bahn.guru/?journey=${JSON.stringify(journey)}&bc=${bahncard}&class=${params.class}`
}

module.exports = { params, options, station, journeys, shopLink, settings }
