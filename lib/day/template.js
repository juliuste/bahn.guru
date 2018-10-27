'use strict'

const html = require('pithy')
const beautify = require('js-beautify').html
const moment = require('moment-timezone')
const mdf = require('moment-duration-format')
const sort = require('lodash').sortBy
const tail = require('lodash').tail
const reverse = require('lodash').reverse
const timezone = require('../../config').timezone
const options = require('../api').options
const buildLink = require('../api').shopLink
const helpers = require('../helpers')
const settings = require('../api').settings

const productIndex = ['Bus', 'BUS', 'RB', 'RE', 'IRE', 'IC', 'IEC', 'EC', 'ICE']

const head = (data) => {
	const title = generateSubTitleRoute(data).join('')+' | Tagesansicht'
	const elements = [
		...helpers.staticHeader(),
		html.title(null, `${title} | ${settings.title}`),
	    ...helpers.opengraph(title),
		html.link({rel: 'stylesheet', type: 'text/css', href: 'assets/styles/day.css'})
	]
	return html.head(null, elements)
}

const generateProducts = (legs) => {
	if(!legs) return null
	const result = []
	for(let leg of legs){
		if(result.indexOf(leg.product)<0)
			result.push(leg.product)
	}
	return reverse(sort(result, (x) => productIndex.indexOf(x)))
}


const collectVias = (journey) => {
	if(journey.legs.length<=1) return ['–']
	const vias = []
	for(let leg of journey.legs){
		if(leg!==journey.legs[journey.legs.length-1]) vias.push(leg.destination.name, html.br())
	}
	vias.pop()
	return vias
}

const parseJourney = (params) => (journey) => {
	let formattedDuration = moment.duration(journey.duration).format('h:mm')
	if(formattedDuration.split(':').length<=1) formattedDuration = '0:'+formattedDuration
	return {
		departure: moment(journey.legs[0].departure).tz(timezone).format('HH:mm'),
		arrival: moment(journey.legs[journey.legs.length-1].arrival).tz(timezone).format('HH:mm'),
		origin: params.origin.name,
		destination: params.destination.name,
		products: generateProducts(journey.legs),
		transfers: journey.legs.length-1,
		price: journey.formattedPrice,
		rawPrice: journey.price.amount,
		rawDuration: moment.duration(journey.duration).format('m'),
		hourDuration: moment.duration(journey.duration).format('h'),
		duration: formattedDuration,
		cheapest: journey.cheapest,
		via: collectVias(journey),
		link: buildLink(params.origin, params.destination, moment(journey.legs[0].departure).tz(timezone), journey, params) || '#'
	}
}

const products = (journey) => {
	if(journey.products && journey.products.length > 0){
		if(journey.products.length === 1) return [journey.products[0]]
		return [journey.products[0], html.span('.columnLong', [', ', ...tail(journey.products).join(', ')])]
	}
	return ['–']
}

const price = (journey) => [
	html.span('.columnLong', journey.price.euros+","+journey.price.cents+"€"),
	html.span('.columnShort', Math.round(+journey.price.euros + (+journey.price.cents/100))+'€')
]

const cheapestClass = (journey) => {
	return (journey.cheapest) ? {class: 'cheapest'} : null
}


const journeyTable = (data) => {
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
	let journeys = data.output.map(parseJourney(data.input))
	journeys = sort(journeys, ['rawPrice', 'rawDuration'])
	for(let journey of journeys){
		rows.push([html.tr(cheapestClass(journey), [
			html.td(null, [
				journey.departure,
				html.span('.columnLong', ' Uhr')
			]),
			html.td(null, [
				journey.arrival,
				html.span('.columnLong', ' Uhr')
			]),
			html.td(null, [
				html.span('.columnLong', journey.duration),
				html.span('.columnShort', journey.hourDuration+'h')
			]),
			html.td('.changes', ''+journey.transfers),
			html.td({class: 'via columnMiddle'}, journey.via),
			html.td(null, products(journey)),
			html.td('.price', [html.a({href: journey.link, title: settings.shopLinkTitle}, price(journey))])
		])])
	}
	return html.table('#journeys', [head, html.tbody(null, rows)])
}

const generateSubTitleDate = (data) => {
	const date = data.input.date
	return [
		html.span(null, date.format("DD.MM.YYYY"))
	]
}

const generateSubTitleRoute = (data) => {
	return [
		data.input.origin.name,
		' → ',
		data.input.destination.name
	]
}

const generateSubTitleOptions = (data) => {
	const result = options.text(data.input)
	const changeLink = html.a({href: '/?origin='+data.input.origin.name+'&destination='+data.input.destination.name+'&'+(options.url(data.input).join('&')), id: 'change'}, 'Anfrage ändern...')
	if(result.length){
		result.push('. ')
	}
	return [html.span(null, result), changeLink]
}

const generate = (data) => {
	let document = '<!doctype html>' + html.html(null, [
		head(data),
		html.body(null, [
			html.div('#page', [
				html.div('#header', [html.a({href: "/", title: "Preiskalender"}, [html.h1(null, 'Preiskalender')])]),
				html.div({class: 'subtitle'}, [html.span(null, generateSubTitleRoute(data))]),
				html.div({id: 'date', class: 'subtitle'}, generateSubTitleDate(data)),
				html.div({id: 'options', class: 'subtitle'}, generateSubTitleOptions(data)),
				journeyTable(data)
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
