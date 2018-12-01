'use strict'

const params = require('./lib/params')
const options = require('./lib/options')
const station = require('./lib/station')
const journeys = require('./lib/journeys')
const settings = require('./settings')

const shopLink = (origin, destination, date, journey, params) => {
	date = date.format('DD.MM.YYYY')
	return `https://shop.flixbus.de/search?departureCity=${origin.id}&arrivalCity=${destination.id}&_locale=de&rideDate=${date}`
}

module.exports = { params, options, station, journeys, shopLink, settings }
