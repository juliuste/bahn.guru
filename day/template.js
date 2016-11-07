'use strict'

const html = require('pithy')
const beautify = require('js-beautify').html
const moment = require('moment-timezone')
const mdf = require('moment-duration-format')
const sort = require('lodash').sortBy
const enc = require('urlencode')

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


const collectVias = (offer) => {
	if(offer.trips.length<=1) return ['-']
	const vias = []
	for(let trip of offer.trips){
		if(trip!==offer.trips[offer.trips.length-1]) vias.push(trip.to.name, html.br())
	}
	vias.pop()
	return vias
}

const parseOffer = (params) => (offer) => {
	if(offer.price.euros==25) console.log(offer.offer.raw.sids)
	let formattedDuration = moment.duration(offer.duration).format('h:mm')
	if(formattedDuration.split(':').length<=1) formattedDuration = '0:'+formattedDuration
	return {
		start: moment(offer.trips[0].start).format('HH:mm'),
		end: moment(offer.trips[offer.trips.length-1].end).format('HH:mm'),
		from: params.from.name,
		to: params.to.name,
		types: generateTypes(offer.trips),
		transfers: offer.transfers,
		price: offer.price,
		token: offer.token,
		rawPrice: +offer.price.euros+(offer.price.cents/100),
		rawDuration: moment.duration(offer.duration).format('m'),
		duration: formattedDuration,
		cheapest: offer.cheapest,
		via: collectVias(offer)
	}
}

const journey = (offer) => {
	let result = [
		offer.start, ' ', offer.from,
		html.br(),
		' → ', offer.end, ' ', offer.to
	]
	return result
}

const types = (offer) => offer.types.join(', ')
const price = (offer) => offer.price.euros+","+offer.price.cents+"€"
const cheapestClass = (offer) => {
	return (offer.cheapest) ? {class: 'cheapest'} : null
}

/*const checkout = (token, price) => {
	/*return html.form({class: 'buy', method: 'post', enctype: 'application/x-www-form-urlencoded', 'action': 'https://ps.bahn.de/preissuche/preissuche/psc_angebote.post?device=HANDY'}, [
		html.input({type: 'hidden', name: 'auslandLocId', value: ' '}),
		html.input({type: 'hidden', name: 'angebotsdetailsanfrage-json', value: token}),
		html.input({type: 'hidden', name: 'button.buchen.unten_p_js', value: ' '}),
		html.input({type: 'submit', value: price, class: 'buyButton'})
	])
	return html.a({class: '.price', href: 'dbnavigator://angebotsdetails&v=15100000&angebotsdetailsanfrage-json='+enc(token)}, price)
}*/


const offerTable = (data) => {
	if(!data) return html.span()
	let rows = [html.tr(null, [
		html.th(null, 'Abfahrt'),
		html.th(null, 'Ankunft'),
		html.th(null, 'Dauer'),
		html.th(null, 'Umstiege'),
		html.th(null, 'Via'),
		html.th(null, 'Zugtypen'),
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
			html.td('.price', price(offer)/*[checkout(offer.token, price(offer))]*/)
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

const paramText = (params) => {
	const result = []
	if(params.class&&params.class==1) result.push(params.class+'. Klasse', ', ')
	if(params.bc&&(params.bc==1||params.bc==2)) result.push('mit BahnCard 25', ', ')
	if(params.bc&&(params.bc==3||params.bc==4)) result.push('mit BahnCard 50', ', ')
	if(params.start&&params.start.format('m')>0) result.push('ab '+params.start.format('HH:mm')+' Uhr', ', ')
	if(params.end&&params.end.format('m')>0) result.push('bis '+params.end.format('HH:mm')+' Uhr', ', ')
	if(params.duration&&params.duration>0) result.push('Fahrzeit bis '+params.duration+' Stunden', ', ')
	if(result.length) result.pop()
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
		html.p('.subtitle', paramText(data.input)),
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