'use strict'

const html = require('pithy')
const beautify = require('js-beautify').html
const moment = require('moment-timezone')
const mdf = require('moment-duration-format')
const sort = require('lodash').sortBy
const enc = require('urlencode')
const timezone = require('config').timezone
const options = require('../api').options
const buildLink = require('../api').shopLink

const head = () => {
	const elements = [
		html.meta({charset: 'utf-8'}),
		html.meta({name: 'viewport', content: "width=device-width, initial-scale=1.0, user-scalable=no"}),
		html.title(null, 'DB Preiskalender'),
		html.link({rel: 'stylesheet', type: 'text/css', href: 'assets/general.css'}),
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
	return result
}


const collectVias = (connection) => {
	if(connection.trips.length<=1) return ['-']
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
		duration: formattedDuration,
		cheapest: connection.cheapest,
		via: collectVias(connection),
		link: buildLink(params.from, params.to, params.class, params.bc, moment(connection.start).tz(timezone).format('DD.MM.YY')) || '#'
	}
}

const types = (offer) => offer.types.join(', ') || '-'
const price = (offer) => offer.price.euros+","+offer.price.cents+"€"
const cheapestClass = (offer) => {
	return (offer.cheapest) ? {class: 'cheapest'} : null
}


const offerTable = (data) => {
	if(!data) return html.span()
	let rows = [html.tr(null, [
		html.th(null, 'Abfahrt'),
		html.th(null, 'Ankunft'),
		html.th(null, 'Dauer'),
		html.th(null, 'Umstiege'),
		html.th(null, 'Via'),
		html.th(null, 'Typen'),
		html.th(null, 'Preis')
	])]
	let offers = data.output.map(parseOffer(data.input))
	offers = sort(offers, ['rawPrice', 'rawDuration'])
	for(let offer of offers){
		rows.push([html.tr(cheapestClass(offer), [
			html.td(null, offer.start+' Uhr'),
			html.td(null, offer.end+' Uhr'),
			html.td(null, offer.duration),
			html.td(null, ''+offer.transfers),
			html.td(null, offer.via),
			html.td(null, types(offer)),
			html.td('.price', [html.a({href: offer.link, title: 'zum Bahn-Shop'}, price(offer))]/*[checkout(offer.token, price(offer))]*/)
		])])
	}
	return html.table('#offers', rows)
}

const generateSubTitleDate = (data) => {
	const date = data.input.date
	return [
		' für den ',
		html.b('.day', date.format("DD.MM.YYYY"))
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
	const changeLink = html.a({href: '/?from='+data.input.from.name+'&to='+data.input.to.name+'&'+(options.url(data.input).join('&')), id: 'changeLink'}, 'Anfrage ändern...')
	if(result.length){
		result.push('. ')
	}
	result.push(changeLink)
	return result
}

const page = (data, error) => {
	if(error || !data) return [
		html.h1('#title', 'Fehler'),
		html.p('#error', error || 'Unbekannter Fehler. Bitte versuchen Sie es erneut oder kontaktieren Sie den Support.')
	]
	return [
		html.h1('#title', 'Preisangebote'),
		html.p('.subtitle', generateSubTitleRoute(data)),
		html.p('.subtitle', generateSubTitleDate(data)),
		html.p('.subtitle', generateSubTitleOptions(data)),
		offerTable(data)
	]
}

const generate = (data, error) => {
	let document = '<!doctype html>' + html.html(null, [
		head(),
		html.body(null, [
			html.div('#page', [
				page(data, error)
			]),
			html.span('#footer', [html.a({href: '/impressum'}, 'Impressum & Rechtliches')])
		])
	])
	return beautify(document)
}

module.exports = generate
