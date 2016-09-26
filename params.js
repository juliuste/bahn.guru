'use strict'

const moment = require('moment-timezone')
const mdf = require('moment-duration-format')
const stations = require('db-hafas').locations

const parseStation = (station) => {
	if(!station || (!station.name && !+station.id)) return Promise.reject(false)
	return stations(station.id+'' || station.name).then(
		(data) => {
			if(data.length>0) return {id: data[0].id, name: data[0].name}
			return false
		},
		(error) => false)
}

const parseTime = (time) => {
	if(!time) return null
	time = time.split(':')
	if(time.length==1){
		let hours = +time[0]
		if(hours!=NaN && hours>=0 && hours<24) return moment.duration(hours, 'hours')
	}
	if(time.length==2){
		let hours = +time[0]
		let minutes = +time[1]
		if(hours!=NaN && minutes!=NaN && hours>=0 && hours<24 && minutes>=0 && minutes<60) return moment.duration(60*hours+minutes, 'minutes')
	}
	return null
}

const parseParams = (params) => {
	const settings = {
		weeks: 4,
		class: 2,
		bc: 0,
		price: null,
		duration: null,
		start: null,
		end: null
	}

	const from = {id: params.fromID, name: params.from}
	const to = {id: params.toID, name: params.to}

	return Promise.all([parseStation(from), parseStation(to)]).then(
		(data) => {
			if(!data || data.length!=2 || !data[0] || !data[1]) return {status: 'error', msg: 'Bitte geben Sie einen gültigen Start- und Zielbahnhof an.'}
			// Stations
			settings.from = data[0]
			settings.to = data[1]
			// Class
			if(+params.class==1 || +params.class==2) settings.class = +params.class
			// BahnCard
			if([0,2,4].indexOf(+params.bc)!=-1) settings.bc = +params.bc+(settings.class-2)
			// Weeks
			if(+params.weeks && +params.weeks<=12 && +params.weeks>0) settings.weeks = +params.weeks
			// Price
			if(+params.price && +params.price>0 && +params.price<999) settings.price = +params.price
			// Duration
			if(+params.duration && +params.duration>0 && +params.duration<24) settings.duration = +params.duration
			// Start & End
			settings.start = parseTime(params.start)
			settings.end = parseTime(params.end)
			if((settings.start && settings.end) && +settings.end.format('m')<+settings.start.format('m')) settings.end = null

			return {status: 'success', data: settings}
		},
		(error) => {
			return {status: 'error', msg: 'Bitte geben sie einen gültigen Start- und Zielbahnhof an.'}
		}
	)
}

module.exports = parseParams