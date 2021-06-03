export { default as params } from './lib/params.js'
export * as options from './lib/options.js'
export { default as station } from './lib/station.js'
export { default as journeys } from './lib/journeys.js'
export { default as settings } from './settings.js'

export const shopLink = (origin, destination, date, journey, params) => {
	date = date.format('DD.MM.YYYY')
	return `https://shop.flixbus.de/search?departureCity=${origin.id}&arrivalCity=${destination.id}&_locale=de&rideDate=${date}`
}
