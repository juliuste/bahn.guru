'use strict'

const html = require('pithy')
const beautify = require('js-beautify').html
const moment = require('moment-timezone')
// eslint-disable-next-line no-unused-vars
const mdf = require('moment-duration-format')
const helpers = require('../helpers')

const head = (api, data) => {
	const title = generateSubTitleRoute(data).join('') + ' | Kalender'
	const elements = [
		...helpers.staticHeader(api),
		html.title(null, ` ${title} | ${api.settings.title}`),
		...helpers.opengraph({ api, extraTitle: title }),
		html.link({ rel: 'stylesheet', type: 'text/css', href: '/assets/styles/calendar.css' }),
	]
	return html.head(null, elements)
}

const generateSubTitleRoute = (data) => {
	return [
		data.input.origin.name,
		' → ',
		data.input.destination.name,
	]
}

const generateSubTitleOptions = (api, data) => {
	const result = api.options.text(data.input)
	const changeLink = html.a({ href: './start?origin=' + data.input.origin.name + '&destination=' + data.input.destination.name + '&' + (api.options.url(data.input).join('&')), id: 'change' }, 'Anfrage ändern...')
	if (result.length) {
		result.push('. ')
	}
	return [html.span(null, result), changeLink]
}

const calendar = (api, data) => {
	if (!data) return html.span()
	const cal = data.output
	const weeks = []
	let counter = 0
	for (const week of cal) {
		const days = []
		for (const day of week) {
			const splitDate = day.date.formatted.split(' ')
			const date = [splitDate[0]]
			const dayClass = (date[0] === '1') ? ' new-month' : ''
			if (splitDate.length > 1) date.push(html.span('.month', ` ${splitDate[1]}`))
			if (day.past || !day.price || !day.duration) {
				days.push(html.td({ class: 'cell empty' + dayClass }, [
					html.span('.date', date),
					html.div('.priceGroup', [html.span('.price', '–')]),
					html.span('.duration', [new html.SafeString('&nbsp;')]),
				]))
			} else {
				days.push(html.td({ class: (day.cheapest ? 'cheapest' : '') + dayClass }, [
					html.a({ class: 'cell', href: dayURL(api, data, day) }, [
						html.span('.date', date),
						html.div('.priceGroup', [
							html.span('.price', [
								html.span('.priceLong', [day.price.euros, html.sup(null, day.price.cents)]),
								html.span('.priceShort', Math.round(+day.price.euros + (+day.price.cents / 100)) + '€'),
							]),
							html.span('.inlineDuration', day.duration),
						]),
						html.span('.duration', '🕒 ' + day.duration),
					]),
				]))
			}
		}
		weeks.push(html.tr((counter++ % 2 === 0) ? '.even' : null, days))
	}
	return html.table('#calendar', [
		html.thead(null, [html.tr(null, [
			html.th(null, [
				html.span('.dayLong', 'Montag'),
				html.span('.dayShort', 'Mo'),
			]),
			html.th(null, [
				html.span('.dayLong', 'Dienstag'),
				html.span('.dayShort', 'Di'),
			]),
			html.th(null, [
				html.span('.dayLong', 'Mittwoch'),
				html.span('.dayShort', 'Mi'),
			]),
			html.th(null, [
				html.span('.dayLong', 'Donnerstag'),
				html.span('.dayShort', 'Do'),
			]),
			html.th(null, [
				html.span('.dayLong', 'Freitag'),
				html.span('.dayShort', 'Fr'),
			]),
			html.th(null, [
				html.span('.dayLong', 'Samstag'),
				html.span('.dayShort', 'Sa'),
			]),
			html.th(null, [
				html.span('.dayLong', 'Sonntag'),
				html.span('.dayShort', 'So'),
			]),
		])]),
		html.tbody(null, weeks),
	])
}

const dayURL = (api, data, day) => {
	if (!data) return null
	const date = moment(day.date.raw).format('DD.MM.YYYY')
	return `./day?origin=${data.input.origin.name}&destination=${data.input.destination.name}&${api.options.url(data.input).join('&')}&date=${date}`
}

const moreLink = (api, data) => {
	if (!data) return null
	const weeks = (data.input.weeks + 2 <= 12) ? data.input.weeks + 2 : 12
	return [html.a({ id: 'later', href: `./calendar?origin=${data.input.origin.name}&destination=${data.input.destination.name}&${api.options.url(data.input).join('&')}&weeks=${weeks}&submit=Y#later` }, 'Mehr anzeigen...')]
}

const createTemplate = api => (data, error) => {
	const document = '<!doctype html>' + html.html(null, [
		head(api, data),
		html.body(null, [
			html.div('#page', [
				html.div('#header', [html.a({ href: './start', title: 'Preiskalender' }, [html.h1(null, 'Preiskalender')])]),
				html.div({ id: 'route', class: 'subtitle' }, [html.span(null, generateSubTitleRoute(data))]),
				html.div({ id: 'options', class: 'subtitle' }, generateSubTitleOptions(api, data)),
				calendar(api, data),
				html.div('#more', moreLink(api, data)),
			]),
			html.div('#footer', [
				html.a({ id: 'faq', href: './faq' }, 'FAQ'),
				html.span(null, ' – '),
				html.a({ id: 'impressum', href: './impressum' }, 'Rechtliches'),
			]),
		]),
	])
	return beautify(document)
}

module.exports = createTemplate
