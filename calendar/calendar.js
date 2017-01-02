'use strict'

const api = require('../api').request
const chunk = require('chunk-array').chunks
const formatDuration = require('ms')
const moment = require('moment')
const l = require('../lib')

const formatDayResult = (params) => (result) => {
	if(result.length) return {
		price: l.formatPrice(result[0].price),
		duration: formatDuration(result[0].duration)
	}
	return null
}

const markCheapest = (dayResults) => {
	// Find cheapest offer(s)
	let cheapest = null
	for(let day of dayResults){if(day && day.price && (!cheapest || +day.price.euros<cheapest)) cheapest = +day.price.euros}
	// Mark cheapest offer(s)
	for(let day of dayResults){if(day && day.price) day.cheapest = (+day.price.euros===cheapest)}
	return dayResults
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

const fillCalendar = (cal, dayResults) => {
	let counter = 0
	for(let day of cal){
		if(!day.past) Object.assign(day, dayResults[counter++] || {price: false, duration: false})
	}
	return chunk(cal, 7)
}


const calendar = (params) => {
	const cal = generateCalendar(params.weeks)
	const requests = []
	for(let day of cal){
		if(!day.past) requests.push(api(params, day.date.raw))
	}

	return Promise.all(requests).then(
		(dayResults) => {
			dayResults = dayResults.map(formatDayResult(params))
			if(dayResults.every((element) => !element)) return null
			dayResults = markCheapest(dayResults)
			return fillCalendar(cal, dayResults)
		},
		(error) => {
			return null
		}
	)
}

module.exports = calendar