'use strict'

const client = require('meinfernbus').journeys
const moment = require('moment-timezone')
const timezone = require('config').timezone

// send request
const journeys = (params, day) => {
	const dayTimestamp = +(moment.tz(day, timezone).startOf('day'))
	return client(params.origin, params.destination, moment(day).toDate()).catch(console.error)
	.then(results =>
		results.filter(j => {
			const departure = new Date(j.legs[0].departure)
			const arrival = new Date(j.legs[j.legs.length-1].arrival)
			const duration = +arrival - (+departure)
			return (
				(!params.duration || duration<=params.duration*60*60*1000) &&
				(!params.departureAfter || +departure>=+params.departureAfter+dayTimestamp) &&
				(!params.arrivalBefore || +arrival <= +params.arrivalBefore+dayTimestamp)
			)
		})
	)
	.then(results => {
		for(let journey of results){
			for(let leg of journey.legs){
				leg.product = 'Bus'
			}
		}
		return results
	})
	.catch(err => {
		console.error(err)
		return []
	})
}

module.exports = journeys