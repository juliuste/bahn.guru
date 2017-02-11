'use strict'

const html = require('pithy')
const beautify = require('js-beautify').html
const moment = require('moment-timezone')
const mdf = require('moment-duration-format')
const sort = require('lodash').sortBy
const options = require('../api').options

const head = () => {
	const elements = [
		html.meta({charset: 'utf-8'}),
		html.meta({name: 'viewport', content: "width=device-width, initial-scale=1.0, user-scalable=no"}),
		html.title(null, 'DB Preiskalender'),
		html.link({rel: 'stylesheet', type: 'text/css', href: 'assets/general.css'}),
		html.link({rel: 'stylesheet', type: 'text/css', href: 'assets/calendar.css'})
	]
	return html.head(null, elements)
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

const page = (data) => {
	if(!data) return [
		html.h1('#title', 'Fehler'),
		html.p('#error', error || 'Unbekannter Fehler. Bitte versuchen Sie es erneut oder kontaktieren Sie den Support.')
	]
	return [
		html.h1('#title', 'Preisangebote'),
		html.p('.subtitle', generateSubTitleRoute(data)),
		html.p('.subtitle', generateSubTitleOptions(data)),
		calendar(data),
		html.p('#moreLink', moreLink(data))
	]
}

const calendar = (data) => {
	if(!data) return html.span()
	const cal = data.output
	let weeks = []
	let counter = 0
	for(let week of cal){
		let days = []
		for(let day of week){
			days.push(html.td({class: (day.past)? 'empty' : ((day.cheapest)? 'cheapest' : '')}, [
				html.span('.date', day.date.formatted),
				html.div('.cell', [
					html.span('.price', (!day.past) ? ((day.price) ? [html.a({href: dayURL(data, day)}, [day.price.euros, html.sup(null, day.price.cents)]), html.br(null)] : ['–', html.br(null)]) : ''),
					html.span('.duration', (!day.past && day.duration) ? ('🕒 '+day.duration) : '')
				])
			]))
		}
		weeks.push(html.tr((counter++%2==0) ? '.even' : null, days))
	}
	return html.table('#calendar', [
		html.thead(null, [html.tr(null, [
			html.th(null, 'Montag'),
			html.th(null, 'Dienstag'),
			html.th(null, 'Mittwoch'),
			html.th(null, 'Donnerstag'),
			html.th(null, 'Freitag'),
			html.th(null, 'Samstag'),
			html.th(null, 'Sonntag')
		])]),
		html.tbody(null, weeks),
	])
}

const dayURL = (data, day) => {
	if(!data) return null
	const date = moment(day.date.raw).format('DD.MM.YYYY')
	return `/day?from=${data.input.from.name}&to=${data.input.to.name}&${options.url(data.input).join('&')}&date=${date}`
	// return `./day?fromID=${i.from.id}&toID=${i.to.id}&class=${i.class}&bc=${bc}&duration=${i.duration}&start=${start}&end=${end}&date=${date}`
}

const moreLink = (data) => {
	if(!data) return null
	const weeks = (data.input.weeks+2<=12)? data.input.weeks+2 : 12
	return [html.a({id: 'later', href: `/calendar?from=${data.input.from.name}&to=${data.input.to.name}&${options.url(data.input).join('&')}&weeks=${weeks}&submit=Y#later`}, 'weitere Termine anzeigen...')]
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