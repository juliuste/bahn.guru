'use strict'

const source = require('db-prices')
const sortby = require('lodash.sortby')
const filter = require('lodash.filter')
const moment = require('moment-timezone')
const timezone = require('config').timezone

// format results
const adapter = (result) => {
	const connections = []
	for(let connection of result){
		const start = new Date(connection.trips[0].start)
		const end = new Date(connection.trips[connection.trips.length-1].end)
		const duration = +end - (+start)
		const price = +connection.offer.price
		
		const trips = []
		for(let trip of connection.trips){
			trips.push({
				from: trip.from,
				to: trip.to,
				start: new Date(trip.start),
				end: new Date(trip.end),
				duration: +new Date(trip.end) - (+new Date(trip.start)),
				type: trip.type
			})
		}

		const transfers = trips.length - 1

		connections.push({start, end, duration, price, trips, transfers})
	}
	return sortby(filter(connections, (o) => o.price), ['price', 'duration'])
}

// send request
const route = (params, day) => {
	const dayTimestamp = +(moment.tz(day, timezone).startOf('day'))
	return source(
		params.from.id,
		params.to.id,
		day,
		{
			class: params.class,
			travellers: [{typ: 'E', bc: params.bc}]
		}
	)
	.then(adapter)
	.then((result) => 
		filter(result, (c) => (
			(!params.duration || c.duration<=params.duration*60*60*1000) &&
			(!params.start || +c.start>=+params.start+dayTimestamp) &&
			(!params.end || +c.end <= +params.end+dayTimestamp)
		))
	)
}

module.exports = route