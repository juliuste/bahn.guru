import pick from 'lodash/pick.js'

export { default as params } from './lib/params.js'
export * as options from './lib/options.js'
export { default as station } from './lib/station.js'
export { default as journeys } from './lib/journeys.js'
export { default as settings } from './settings.js'

export const shopLink = (origin, destination, date, journey, params) => {
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
