'use strict'

const html = require('pithy')
const beautify = require('js-beautify').html
const moment = require('moment-timezone')
const mdf = require('moment-duration-format')
const sort = require('lodash').sortBy

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

const paramText = (data) => {
	const params = data.input
	const result = []
	if(params.class&&params.class==1) result.push(params.class+'. Klasse', ', ')
	if(params.bc&&(params.bc==1||params.bc==2)) result.push('mit BahnCard 25', ', ')
	if(params.bc&&(params.bc==3||params.bc==4)) result.push('mit BahnCard 50', ', ')
	if(params.start&&params.start.format('m')>0) result.push('ab '+params.start.format('HH:mm')+' Uhr', ', ')
	if(params.end&&params.end.format('m')>0) result.push('bis '+params.end.format('HH:mm')+' Uhr', ', ')
	if(params.duration&&params.duration>0) result.push('Fahrzeit bis '+params.duration+' Stunden', ', ')
	const changeLink = html.a({href: changeURL(data), id: 'changeLink'}, 'Anfrage ändern...')
	if(result.length){
		result.pop()
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
		html.p('.subtitle', paramText(data)),
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
	const i = data.input
	const bc = i.bc + (i.bc%2)
	const start = (i.start)? i.start.format('hh:mm') : null
	const end = (i.end)? i.end.format('hh:mm') : null
	return `./day?fromID=${i.from.id}&toID=${i.to.id}&class=${i.class}&bc=${bc}&duration=${i.duration}&start=${start}&end=${end}&date=${date}`
}



const changeURL = (data) => {
	if(!data) return null
	const i = data.input
	const bc = i.bc + (i.bc%2)
	const start = (i.start)? i.start.format('hh:mm') : null
	const end = (i.end)? i.end.format('hh:mm') : null
	return `./?fromID=${i.from.id}&toID=${i.to.id}&class=${i.class}&bc=${bc}&duration=${i.duration}&start=${start}&end=${end}`
}

const moreLink = (data) => {
	if(!data) return null
	const i = data.input
	const bc = i.bc + (i.bc%2)
	const weeks = (i.weeks+2<=12)? i.weeks+2 : 12
	const start = (i.start)? i.start.format('hh:mm') : null
	const end = (i.end)? i.end.format('hh:mm') : null
	return [html.a({id: 'later', href: `./calendar?fromID=${i.from.id}&toID=${i.to.id}&class=${i.class}&bc=${bc}&weeks=${weeks}&duration=${i.duration}&start=${start}&end=${end}&submit=Y#later`}, 'weitere Termine anzeigen...')]
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