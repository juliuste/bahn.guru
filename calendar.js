'use strict'

const moment = require('moment-timezone')
const mdf = require('moment-duration-format')
const prices = require('db-prices')
const chunk = require('chunk-array').chunks

const formatPrice = (price) => {
	price = price.toFixed(2).toString().split('.') 
	return {euros: price[0], cents: price[1]}
}

const parsePriceResult = (params) => (priceResult) => {
	let duration, tMS, start, startTime, end, endTime, price, cheapest = null
	for(let offer of priceResult){
		// Extract Start & End
		start = moment(offer.trips[0].start)
		startTime = start.diff(moment(start).startOf('day'))
		end = moment(offer.trips[offer.trips.length-1].end)
		endTime = end.diff(moment(end).startOf('day'))
		// Extract Price
		price = +offer.offer.price

		if(	(!params.price || price<=params.price) &&
			(!params.duration || params.duration*60*60*1000>=end.diff(start)) &&
			(!params.start || startTime>=params.start.format('S')) &&
			(!params.end || (start.format('D') == end.format('D') && endTime<=params.end.format('S')))){
				if(!cheapest || price<cheapest){
					cheapest = price
					duration = end.diff(start)
				}
				if(price==cheapest && end.diff(start)<duration) duration = end.diff(start)
		}
	}

	if(!cheapest) return false
	return {
		price: formatPrice(cheapest),
		duration: moment.duration(duration).format('h:mm')
	}
}

const markCheapest = (results) => {
	// Find cheapest offer(s)
	let cheapest = null
	for(let offer of results){if(offer.price && (!cheapest || +offer.price.euros<cheapest)) cheapest = +offer.price.euros}
	// Mark cheapest offer(s)
	for(let offer of results){if(offer.price) offer.cheapest = (+offer.price.euros===cheapest)}
	return results
}

const generateCalendar = (weeks) => {
	let date = moment().tz('Europe/Berlin')
	let emptyDates = 0
	while(date.format('E')!=1){date.subtract(1, 'days'); emptyDates++} // go back to last monday

	const dates = []
	for(let i=0; i<weeks*7; i++){
		if(dates.length==0 || +date.format('D')==1) dates.push({date: {raw: moment(date), formatted: date.format('D MMM')}, past: (i<emptyDates)})
		else dates.push({date: {raw: moment(date), formatted: date.format('D')}, past: (i<emptyDates)})
		
		date.add(1, 'days')
		if(i>=emptyDates) date = date.startOf('day')
	}
	
	return dates
}

const fillCalendar = (cal, offers) => {
	let counter = 0
	for(let day of cal){if(!day.past) Object.assign(day, offers[counter++] || {price: false, duration: false})}
	return chunk(cal, 7)
}


const calendar = (params) => {
	const cal = generateCalendar(params.weeks)
	const requests = []
	for(let day of cal){
		if(!day.past)
			requests.push(prices(params.from.id, params.to.id, day.date.raw, {
				class: params.class,
				travellers: [{typ: 'E', bc: params.bc}]
			}))
	}

	return Promise.all(requests).then(
		(results) => {
			results = results.map(parsePriceResult(params))
			if(results.every((element) => !element)) return null
			results = markCheapest(results)
			return fillCalendar(cal, results)
		},
		(error) => {
			return null
		}
	)
}

module.exports = calendar