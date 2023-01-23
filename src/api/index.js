import { URL } from 'url'

export { default as params } from './lib/params.js'
export * as options from './lib/options.js'
export { default as station } from './lib/station.js'
export { default as journeys } from './lib/journeys.js'
export { default as settings } from './settings.js'

export const shopLink = (origin, destination, date, journey, params) => {
	let bahncard = params.bc
	if (params.class === 1) {
		if (params.bc === 2) bahncard = 1
		if (params.bc === 4) bahncard = 3
	}

	const url = new URL('https://link.bahn.guru/')
	url.searchParams.append('journey', JSON.stringify(journey))
	url.searchParams.append('bc', bahncard)
	url.searchParams.append('class', params.class)
	return url.toString()
}
