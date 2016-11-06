'use strict'

const moment = require('moment-timezone')
const mdf = require('moment-duration-format')
const prices = require('db-prices')

const formatPrice = (price) => {
	price = price.toFixed(2).toString().split('.') 
	return {euros: price[0], cents: price[1]}
}

const generateToken = (params) => (connection, offer) => {
	const angJSON = {
		angebotHin: offer,
		verbindungHin: connection,
		c: params.class,
		travellers: [{typ: "E", bc: params.bc, alter: ""}],
		device: 'HANDY'
	}
	return JSON.stringify(angJSON)
}

const parsePriceResult = (params) => (priceResult) => {
	let results = [], start, startTime, end, endTime, price, link = null
	for(let offer of priceResult){
		// Extract Start & End
		start = moment(offer.trips[0].start)
		startTime = start.diff(moment(start).startOf('day'))
		end = moment(offer.trips[offer.trips.length-1].end)
		endTime = end.diff(moment(end).startOf('day'))

		if(	(+offer.offer.price) &&
			(!params.duration || params.duration*60*60*1000>=end.diff(start)) &&
			(!params.start || startTime>=params.start.format('S')) &&
			(!params.end || (start.format('D') == end.format('D') && endTime<=params.end.format('S')))){
			offer.token = generateToken(params)(offer.raw, offer.offer.raw)
			offer.price = formatPrice(+offer.offer.price)
			offer.duration = end.diff(start)
			results.push(offer)
		}
	}

	return (results.length) ? results : null
}

const markCheapest = (results) => {
	if(!results) return null
	// Find cheapest offer(s)
	let cheapest = null
	for(let offer of results){if(offer.price && (!cheapest || +offer.price.euros<cheapest)) cheapest = +offer.price.euros}
	// Mark cheapest offer(s)
	for(let offer of results){if(offer.price) offer.cheapest = (+offer.price.euros===cheapest)}
	return results
}


const day = (params) => {
	return prices(params.from.id, params.to.id, params.date.toDate(), {
		class: params.class,
		travellers: [{typ: 'E', bc: params.bc}]
	}).then(
		(result) => {
			result = parsePriceResult(params)(result)
			return markCheapest(result)
		},
		(error) => {
			return null
		}
	)
}

module.exports = day