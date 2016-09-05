'use strict'

const moment = require('moment-timezone')
const mdf = require('moment-duration-format')
const stations = require('db-hafas').locations
const prices = require('db-prices')
const template = require('./template')


const errorMsg = 'Es ist ein Fehler bei der Abfrage der Daten aufgetreten. Bitte versuchen Sie es erneut oder kontaktieren Sie uns.'

const getStation = (id, name) => {
	if(!name && !+id) return false
	const query = ((+id) ? +id : name) + ''
	return stations(query).then((data) => {
		if(data.length>0) return {id: data[0].id, name: data[0].name}
		return false
	}, (error) => false)
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
	// Locations

	return Promise.all([getStation(params.fromID, params.from), getStation(params.toID, params.to)]).then(
		(data) => {
			if(!data || data.length!=2 || !data[0] || !data[1]) return {status: 'error', msg: 'Bitte geben Sie einen gültigen Start- und Zielbahnhof an.'}
			settings.from = data[0]
			settings.to = data[1]

			// other Settings
			if(+params.class==1 || +params.class==2) settings.class = +params.class
			if([0,2,4].indexOf(+params.bc)!=-1) settings.bc = +params.bc+(settings.class-2)
			if(+params.weeks && +params.weeks<=12 && +params.weeks>0) settings.weeks = +params.weeks
			if(+params.price && +params.price>0 && +params.price<999) settings.price = +params.price
			if(+params.duration && +params.duration>0 && +params.duration<24) settings.duration = +params.duration
			settings.start = parseTime(params.start)
			settings.end = parseTime(params.end)
			if((settings.start && settings.end) && +settings.end.format('m')<+settings.start.format('m')) settings.end = null

			return {status: 'success', data: settings}
		},
		(error) => {
			return {status: 'error', msg: errorMsg}
		}
	)
}

const getDates = (weeks) => {
	const today = moment().tz('Europe/Berlin')
	let date = today
	
	let emptyDates = 0
	while(date.format('E')!=1){
		date.subtract(1, 'days')
		emptyDates++
	}

	const dates = []
	for(let i=0; i<weeks*7; i++){
		dates.push({date: moment(date), past: (i<emptyDates)})
		date.add(1, 'days')
		if(i>=emptyDates) date = date.startOf('day')
	}
	return dates
}

const formatDates = (dates) => {
	const formattedDates = []
	for(let date of dates){
		if(formattedDates.length==0 || date.date.date()==1) formattedDates.push({date: date.date.format('D MMM'), past: date.past})
		else formattedDates.push({date: date.date.format('D'), past: date.past})
	}
	return formattedDates
}

const parsePriceResult = (data) => (priceResult) => {
	let cheapest = 0
	let ms, tMS, start, startTime, end, endTime, prx
	for(let r=0; r<priceResult.length; r++){
		start = moment(priceResult[r].trips[0].start)
		startTime = start.diff(moment(start).startOf('day'))
		end = moment(priceResult[r].trips[priceResult[r].trips.length-1].end)
		endTime = end.diff(moment(end).startOf('day'))
		prx = +priceResult[r].offer.price
		if((!data.price || prx<=data.price) && (!data.duration || data.duration*60*60*1000>=end.diff(start))){
			if((!data.start || startTime>=data.start.format('S')) && (!data.end || (start.format('D') == end.format('D') && endTime<=data.end.format('S')))){
				if(cheapest==0 || prx<cheapest){
					cheapest = prx
					ms = end.diff(start)
				}
				if(prx==cheapest){
					tMS = end.diff(start)
					if(tMS<ms) ms = tMS
				}
			}
		}
	}

	if(cheapest===0) return false

	const result = {}
	const price = cheapest.toFixed(2).toString().split('.')
	result.price = {}
	result.price.euros = price[0]
	result.price.cents = price[1]
	result.duration = moment.duration(ms).format('h:mm')
	return result
}

const chunk = (array, chunkSize) => {
    const chunks = [];
    for(let i = 0; i<array.length; i+=chunkSize) chunks.push(array.slice(i, i+chunkSize))
    return chunks;
}


const format = (tPrices, dates) => {
	const results = []
	let result
	let emptyDates = dates.length-tPrices.length
	for(let i=0; i<dates.length; i++){
		if(i<emptyDates)
			results.push({date: dates[i].date, empty: true})
		else {
			result = tPrices[i-emptyDates]
			if(result) result.date = dates[i].date
			results.push(result)
		}
	}
	return chunk(results, 7)
}

const markCheapest = (data) => {
	if(!data) return null
	let cheapest = false
	for(let dat of data){
		if(dat.price && (!cheapest || +dat.price.euros<cheapest)) cheapest = dat.price.euros
	}
	for(let dat of data){
		if(dat.price && +dat.price.euros==cheapest) dat.cheapest = true
		else if(dat.price) dat.cheapest = false
	}
	return data
}

const calendar = (data) => {
	const rawDates = getDates(data.weeks)
	const formattedDates = formatDates(rawDates)

	const requests = []
	for(let date of rawDates){
		if(!date.past)
			requests.push(
				prices(data.from.id, data.to.id, date.date, {
					class: data.class,
					travellers: [{typ: 'E', bc: data.bc}]
				})
			)
	}

	return Promise.all(requests).then(
		(results) => {
			results = results.map(parsePriceResult(data))
			if(results.every((element) => element===false)) return null
			results = markCheapest(results)
			return {input: data, output: format(results, formattedDates)}
		},
		(error) => {
			throw new Error
		}
	)
}

const route = (req, res, next) => {
	if(!req.query.submit) res.end(template(null, null))
	else{
		parseParams(req.query).then(
			(params) => {
				if(!params || params.status=='error') res.end(template(null, (params)? params.msg : errorMsg))
				else
					calendar(params.data).then(
						(data) => {
							if(data) return res.end(template(data, null))
							return res.end(template(null, 'Leider wurden keine Angebote gefunden, die den Suchkriterien entsprechen.'))
						},
						(error) => {console.error(error); return res.end(template(null, errorMsg))}
					)
			},
			(error) => {
				res.end(template(null, errorMsg))
			}
		)
	}
}

module.exports = route
