'use strict'

const html = require('pithy')
const beautify = require('js-beautify').html
const moment = require('moment-timezone')
const mdf = require('moment-duration-format')
const sort = require('lodash').sortBy
const tail = require('lodash.tail')
const reverse = require('lodash.reverse')
const enc = require('urlencode')
const timezone = require('config').timezone
const options = require('../api').options
const buildLink = require('../api').shopLink

const typeIndex = ['RB', 'RE', 'IRE', 'IC', 'IEC', 'EC', 'ICE']

const head = (data) => {
	const elements = [
		html.meta({charset: 'utf-8'}),
		html.meta({name: 'viewport', content: "width=device-width, initial-scale=1.0"}),
		html.title(null, generateSubTitleRoute(data).join('')+' | Tagesansicht | Bahn-Preiskalender'),
		html.link({rel: 'stylesheet', type: 'text/css', href: 'assets/reset.css'}),
		html.link({rel: 'stylesheet', type: 'text/css', href: 'assets/base.css'}),
		html.link({rel: 'stylesheet', type: 'text/css', href: 'assets/day.css'})
	]
	return html.head(null, elements)
}

const generateTypes = (trips) => {
	if(!trips) return null
	const result = []
	for(let trip of trips){
		if(result.indexOf(trip.type)<0)
			result.push(trip.type)
	}
	return reverse(sort(result, (x) => typeIndex.indexOf(x)))
}


const collectVias = (connection) => {
	if(connection.trips.length<=1) return ['–']
	const vias = []
	for(let trip of connection.trips){
		if(trip!==connection.trips[connection.trips.length-1]) vias.push(trip.to.name, html.br())
	}
	vias.pop()
	return vias
}

const parseOffer = (params) => (connection) => {
	let formattedDuration = moment.duration(connection.duration).format('h:mm')
	if(formattedDuration.split(':').length<=1) formattedDuration = '0:'+formattedDuration
	return {
		start: moment(connection.start).tz(timezone).format('HH:mm'),
		end: moment(connection.end).tz(timezone).format('HH:mm'),
		from: params.from.name,
		to: params.to.name,
		types: generateTypes(connection.trips),
		transfers: connection.transfers,
		price: connection.price,
		rawPrice: +connection.price.euros+(connection.price.cents/100),
		rawDuration: moment.duration(connection.duration).format('m'),
		hourDuration: moment.duration(connection.duration).format('h'),
		duration: formattedDuration,
		cheapest: connection.cheapest,
		via: collectVias(connection),
		link: buildLink(params.from, params.to, params.class, params.bc, moment(connection.start).tz(timezone).format('DD.MM.YY')) || '#'
	}
}

const types = (offer) => {
	if(offer.types && offer.types.length > 0){
		if(offer.types.length === 1) return [offer.types[0]]
		return [offer.types[0], html.span('.columnLong', [', ', ...tail(offer.types).join(', ')])]
	}
	return ['–']
}

const price = (offer) => [
	html.span('.columnLong', offer.price.euros+","+offer.price.cents+"€"),
	html.span('.columnShort', Math.round(+offer.price.euros + (+offer.price.cents/100))+'€')
]

const cheapestClass = (offer) => {
	return (offer.cheapest) ? {class: 'cheapest'} : null
}


const offerTable = (data) => {
	if(!data) return html.span()
	let head = html.thead(null, [html.tr(null, [
		html.th(null, [
			html.span('.columnLong', 'Abfahrt'),
			html.span('.columnShort', 'Ab')
		]),
		html.th(null, [
			html.span('.columnLong', 'Ankunft'),
			html.span('.columnShort', 'An')
		]),
		html.th(null, [
			html.span('.columnLong', 'Dauer'),
			html.span('.columnShort', 'Zeit')
		]),
		html.th('.changes', [
			html.span('.columnLong', 'Umstiege'),
			html.span('.columnShort', '⇔')
		]),
		html.th('.columnMiddle', 'Via'),
		html.th(null, [
			html.span('.columnLong', 'Typen'),
			html.span('.columnShort', 'Typ')
		]),
		html.th(null, 'Preis')
	])])
	let rows = []
	let offers = data.output.map(parseOffer(data.input))
	offers = sort(offers, ['rawPrice', 'rawDuration'])
	for(let offer of offers){
		rows.push([html.tr(cheapestClass(offer), [
			html.td(null, [
				offer.start,
				html.span('.columnLong', ' Uhr')
			]),
			html.td(null, [
				offer.end,
				html.span('.columnLong', ' Uhr')
			]),
			html.td(null, [
				html.span('.columnLong', offer.duration),
				html.span('.columnShort', offer.hourDuration+'h')
			]),
			html.td('.changes', ''+offer.transfers),
			html.td({class: 'via columnMiddle'}, offer.via),
			html.td(null, types(offer)),
			html.td('.price', [html.a({href: offer.link, title: 'zum Bahn-Shop'}, price(offer))]/*[checkout(offer.token, price(offer))]*/)
		])])
	}
	return html.table('#offers', [head, html.tbody(null, rows)])
}

const generateSubTitleDate = (data) => {
	const date = data.input.date
	return [
		html.span(null, date.format("DD.MM.YYYY"))
	]
}

const generateSubTitleRoute = (data) => {
	return [
		data.input.from.name,
		' → ',
		data.input.to.name
	]
}

const generateSubTitleOptions = (data) => {
	const result = options.text(data.input)
	const changeLink = html.a({href: '/?from='+data.input.from.name+'&to='+data.input.to.name+'&'+(options.url(data.input).join('&')), id: 'change'}, 'Anfrage ändern...')
	if(result.length){
		result.push('. ')
	}
	return [html.span(null, result), changeLink]
}

const generate = (data, error) => {
	let document = '<!doctype html>' + html.html(null, [
		head(data),
		html.body(null, [
			html.div('#page', [
				html.div('#header', [html.a({href: "/", title: "Preiskalender"}, [html.h1(null, 'Preiskalender')])]),
				html.div({class: 'subtitle'}, [html.span(null, generateSubTitleRoute(data))]),
				html.div({id: 'date', class: 'subtitle'}, generateSubTitleDate(data)),
				html.div({id: 'options', class: 'subtitle'}, generateSubTitleOptions(data)),
				offerTable(data)
			]),
			html.div('#footer', [
				html.a({id: 'faq', href: '/faq'}, 'FAQ'),
				html.span(null, ' – '),
				html.a({id: 'impressum', href: '/impressum'}, 'Rechtliches')
			])
		])
	])
	return beautify(document)
}

module.exports = generate
