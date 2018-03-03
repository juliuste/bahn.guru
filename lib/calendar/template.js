'use strict'

const html = require('pithy')
const beautify = require('js-beautify').html
const moment = require('moment-timezone')
const mdf = require('moment-duration-format')
const sort = require('lodash').sortBy
const options = require('../api').options
const opengraph = require('../helpers').openGraph
const settings = require('../api').settings

const head = (data) => {
	const title = generateSubTitleRoute(data).join('')+' | Kalender';
	const elements = [
		html.meta({charset: 'utf-8'}),
		html.meta({name: 'viewport', content: "width=device-width, initial-scale=1.0"}),
		html.title(null, ` ${title}| ${settings.title}`),
		...opengraph(title),
		html.link({rel: 'stylesheet', type: 'text/css', href: 'assets/styles/reset.css'}),
		html.link({rel: 'stylesheet', type: 'text/css', href: 'assets/styles/base.css'}),
		html.link({rel: 'stylesheet', type: 'text/css', href: 'assets/styles/calendar.css'}),
		html.link({rel: 'stylesheet', type: 'text/css', href: 'assets/styles/'+require('config').api+'.css'})
	]
	return html.head(null, elements)
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

const calendar = (data) => {
	if(!data) return html.span()
	const cal = data.output
	let weeks = []
	let counter = 0
	for(let week of cal){
		let days = []
		for(let day of week){
			if(day.past || !day.price || !day.duration){
				days.push(html.td({class: 'cell empty'}, [
					html.span('.date', day.date.formatted.split(' ')[0]), // todo
					html.div('.priceGroup', [html.span('.price', '–')]),
					html.span('.duration', [new html.SafeString('&nbsp;')])
				]))
			}
			else{
				days.push(html.td({class: day.cheapest ? 'cheapest' : ''}, [
					html.a({class: 'cell', href: dayURL(data, day)}, [
						html.span('.date', day.date.formatted.split(' ')[0]), // todo
						html.div('.priceGroup', [
							html.span('.price', [
								html.span('.priceLong', [day.price.euros, html.sup(null, day.price.cents)]),
								html.span('.priceShort', Math.round(+day.price.euros+(+day.price.cents/100))+'€')
							]),
							html.span('.inlineDuration', day.duration)
						]),
						html.span('.duration', '🕒 '+day.duration)
					])
				]))
			}
		}
		weeks.push(html.tr((counter++%2==0) ? '.even' : null, days))
	}
	return html.table('#calendar', [
		html.thead(null, [html.tr(null, [
			html.th(null, [
				html.span('.dayLong', 'Montag'),
				html.span('.dayShort', 'Mo')
			]),
			html.th(null, [
				html.span('.dayLong', 'Dienstag'),
				html.span('.dayShort', 'Di')
			]),
			html.th(null, [
				html.span('.dayLong', 'Mittwoch'),
				html.span('.dayShort', 'Mi')
			]),
			html.th(null, [
				html.span('.dayLong', 'Donnerstag'),
				html.span('.dayShort', 'Do')
			]),
			html.th(null, [
				html.span('.dayLong', 'Freitag'),
				html.span('.dayShort', 'Fr')
			]),
			html.th(null, [
				html.span('.dayLong', 'Samstag'),
				html.span('.dayShort', 'Sa')
			]),
			html.th(null, [
				html.span('.dayLong', 'Sonntag'),
				html.span('.dayShort', 'So')
			])
		])]),
		html.tbody(null, weeks),
	])
}

const dayURL = (data, day) => {
	if(!data) return null
	const date = moment(day.date.raw).format('DD.MM.YYYY')
	return `/day?origin=${data.input.origin.name}&destination=${data.input.destination.name}&${options.url(data.input).join('&')}&date=${date}`
}

const moreLink = (data) => {
	if(!data) return null
	const weeks = (data.input.weeks+2<=12)? data.input.weeks+2 : 12
	return [html.a({id: 'later', href: `/calendar?origin=${data.input.origin.name}&destination=${data.input.destination.name}&${options.url(data.input).join('&')}&weeks=${weeks}&submit=Y#later`}, 'Mehr anzeigen...')]
}

const generate = (data, error) => {
	let document = '<!doctype html>' + html.html(null, [
		head(data),
		html.body(null, [
			html.div('#page', [
				html.div('#header', [html.a({href: "/", title: "Preiskalender"}, [html.h1(null, 'Preiskalender')])]),
				html.div({id: 'route', class: 'subtitle'}, [html.span(null, generateSubTitleRoute(data))]),
				html.div({id: 'options', class: 'subtitle'}, generateSubTitleOptions(data)),
				calendar(data),
				html.div('#more', moreLink(data))
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
