'use strict'

const moment = require('moment-timezone')
const mdf = require('moment-duration-format')
const parseStation = require('../api').station
const l = require('../lib')

const parseDate = (date) => {
	if(!date) return moment().tz('Europe/Berlin').startOf('day')
	return moment(date, "DD.MM.YYYY").tz('Europe/Berlin').startOf('day')
}

const parseParams = (params) => {
	const settings = {
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
			// Date
			settings.date = parseDate(params.date)
			// Class
			if(+params.class==1 || +params.class==2) settings.class = +params.class
			// BahnCard
			if([0,2,4].indexOf(+params.bc)!=-1) settings.bc = +params.bc+(settings.class-2)
			// Price
			if(+params.price && +params.price>0 && +params.price<999) settings.price = +params.price
			// Duration
			if(+params.duration && +params.duration>0 && +params.duration<24) settings.duration = +params.duration
			// Start & End
			settings.start = l.parseTime(params.start)
			settings.end = l.parseTime(params.end)
			if((settings.start && settings.end) && +settings.end.format('m')<+settings.start.format('m')) settings.end = null
			return {status: 'success', data: settings}
		},
		(error) => {
			return {status: 'error', msg: 'Bitte geben sie einen gültigen Start- und Zielbahnhof an.'}
		}
	)
}

module.exports = parseParams