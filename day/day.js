'use strict'

const prices = require('db-prices')
const l = require('../lib')
const api = require('../api').request

const formatResult = (result) => Object.assign(result, {price: l.formatPrice(result.price)})

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
	return api(params, params.date).then(
		(results) => markCheapest(results.map(formatResult)),
		(error) => {
			return null
		}
	)
}

module.exports = day