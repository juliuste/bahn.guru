'use strict'

const request = require('sync-request')
const template = require('./template')
const moment = require('moment-timezone')
const got = require('got')
const mdf = require('moment-duration-format')

const stationURL = 'https://db-hafas.juliuste.de/locations?query='
const priceURL = 'https://db-prices.juliuste.de/'

const getStation = (id, name) => {
	if(!name && !+id) return false
	const query = (+id)? +id : name
	const req = JSON.parse(request('GET', stationURL+query).getBody())
	if(req.length>0) return {id: req[0].id, name: req[0].name}
	return false
}

const parseParams = (params) => {
	const settings = {
		weeks: 4,
		class: 2,
		bc: 0,
		duration: null,
		price: null
	}
	// Locations
	settings.from = getStation(params.fromID, params.from)
	settings.to = getStation(params.toID, params.to)

	if(!settings.from || !settings.to) return {status: 'error', msg: 'Bitte geben Sie einen gültigen Start- und Zielbahnhof an.'}

	// other Settings
	if(+params.class==1 || +params.class==2) settings.class = +params.class
	if([0,2,4].indexOf(+params.bc)!=-1) settings.bc = +params.bc+(settings.class-2)
	if(+params.weeks && +params.weeks<=12 && +params.weeks>0) settings.weeks = +params.weeks
	if(+params.duration && +params.duration>0 && +params.duration<24) settings.duration = +params.duration
	if(+params.price && +params.price>0 && +params.price<999) settings.price = +params.price

	return {status: 'success', data: settings}
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
	priceResult = priceResult.body
	let cheapest = 0
	let ms, tMS, start, end, prx
	for(let r=0; r<priceResult.length; r++){
		start = moment(priceResult[r].trips[0].start*1000)
		end = moment(priceResult[r].trips[priceResult[r].trips.length-1].end*1000)
		prx = +priceResult[r].offer.price
		if((!data.price || prx<=data.price) && (!data.duration || data.duration*60*60*1000>=end.diff(start))){
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


const format = (prices, dates) => {
	const results = []
	let result
	let emptyDates = dates.length-prices.length
	for(let i=0; i<dates.length; i++){
		if(i<emptyDates)
			results.push({date: dates[i].date, empty: true})
		else {
			result = prices[i-emptyDates]
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
		if(!cheapest || +dat.price.euros<cheapest) cheapest = dat.price.euros
	}
	for(let dat of data){
		if(+dat.price.euros==cheapest) dat.cheapest = true
		else dat.cheapest = false
	}
	return data
}

const calendar = (data) => {
	const rawDates = getDates(data.weeks)
	const formattedDates = formatDates(rawDates)

	const requests = []
	for(let date of rawDates){
		if(!date.past)
			requests.push(got(priceURL, {json: true, query: {
				from: data.from.id,
				to: data.to.id,
				class: data.class,
				date: date.date.toString(),
				travellers: JSON.stringify([{typ: 'E', bc: data.bc}])
			}}))
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
		const params = parseParams(req.query)
		if(params.status=='error') res.end(template(null, params.msg))
		else
			calendar(params.data).then(
				(data) => {
					if(data) return res.end(template(data, null))
					return res.end(template(null, 'Leider wurden keine Angebote gefunden, die den Suchkriterien entsprechen.'))
				},
				(error) => {console.error(error); res.end(template(null, 'Es ist ein Fehler bei der Abfrage der Daten aufgetreten. Bitte versuchen Sie es erneut oder kontaktieren Sie uns.'))}
			)
	}
}

module.exports = route
