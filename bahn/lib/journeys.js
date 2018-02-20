'use strict'

const client = require('db-prices')
const moment = require('moment-timezone')
const timezone = require('config').timezone


const journeys = (params, day) => {
	const dayTimestamp = +(moment.tz(day, timezone).startOf('day'))
	return client(params.origin.id,	params.destination.id, moment(day).toDate(), {
		class: params.class,
		travellers: [{typ: 'E', bc: params.bc}]
	})
	.then(results =>
		results.filter(j => {
			const departure = new Date(j.legs[0].departure)
			const arrival = new Date(j.legs[j.legs.length-1].arrival)
			const duration = +arrival - (+departure)
			return (
				(!params.duration || duration<=params.duration*60*60*1000) &&
				(!params.departureAfter || +departure>=+params.departureAfter+dayTimestamp) &&
				(!params.arrivalBefore || +arrival <= +params.arrivalBefore+dayTimestamp) &&
				(j.legs.some(l => l.line && l.line.product !== 'BUS'))
			)
		})
	)
	.then(results => {
		for(let journey of results){
			for(let leg of journey.legs){
				leg.product = leg.line ? leg.line.product : null
			}
		}
		return results
	})
	.catch((err) => {
		console.error(err)
		return []
	})
}

module.exports = journeys
