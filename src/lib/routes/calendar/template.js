import { h } from 'hastscript'
import moment from 'moment-timezone'
// eslint-disable-next-line no-unused-vars
import mdf from 'moment-duration-format'
import * as helpers from '../helpers.js'

const head = (api, data) => {
	const title = generateSubTitleRoute(data).join('') + ' | Kalender'
	const elements = [
		...helpers.staticHeader(api),
		h('title', `${title} | ${api.settings.title}`),
		...helpers.opengraph({ api, extraTitle: title }),
		h('link', { rel: 'stylesheet', type: 'text/css', href: '/assets/styles/calendar.css' }),
	]
	return h('head', elements)
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
	const changeLink = h('a', { href: './start?origin=' + data.input.origin.name + '&destination=' + data.input.destination.name + '&' + (api.options.url(data.input).join('&')), id: 'change' }, 'Anfrage ändern...')
	if (result.length) {
		result.push('. ')
	}
	return [h('span', result), changeLink]
}

const calendar = (api, data) => {
	if (!data) return h('span')
	const cal = data.output
	const weeks = []
	let counter = 0
	for (const week of cal) {
		const days = []
		for (const day of week) {
			const splitDate = day.date.formatted.split(' ')
			const date = [splitDate[0]]
			const dayClass = (date[0] === '1') ? ' new-month' : ''
			if (splitDate.length > 1) date.push(h('span.month', ` ${splitDate[1]}`))
			if (day.past || !day.price || !day.duration) {
				days.push(h('td', { class: 'cell empty' + dayClass }, [
					h('span.date', date),
					h('div.priceGroup', [h('span.price', '–')]),
					h('span.duration', '\u200D'),
				]))
			} else {
				days.push(h('td', { class: (day.cheapest ? 'cheapest' : '') + dayClass }, [
					h('a', { class: 'cell', href: dayURL(api, data, day) }, [
						h('span.date', date),
						h('div.priceGroup', [
							h('span.price', [
								h('span.priceLong', [day.price.euros, h('sup', day.price.cents)]),
								h('span.priceShort', Math.round(+day.price.euros + (+day.price.cents / 100)) + '€'),
							]),
							h('span.inlineDuration', day.duration),
						]),
						h('span.duration', '🕒 ' + day.duration),
					]),
				]))
			}
		}
		weeks.push(h((counter++ % 2 === 0) ? 'tr.even' : 'tr', days))
	}
	return h('table#calendar', [
		h('thead', [h('tr', [
			h('th', [
				h('span.dayLong', 'Montag'),
				h('span.dayShort', 'Mo'),
			]),
			h('th', [
				h('span.dayLong', 'Dienstag'),
				h('span.dayShort', 'Di'),
			]),
			h('th', [
				h('span.dayLong', 'Mittwoch'),
				h('span.dayShort', 'Mi'),
			]),
			h('th', [
				h('span.dayLong', 'Donnerstag'),
				h('span.dayShort', 'Do'),
			]),
			h('th', [
				h('span.dayLong', 'Freitag'),
				h('span.dayShort', 'Fr'),
			]),
			h('th', [
				h('span.dayLong', 'Samstag'),
				h('span.dayShort', 'Sa'),
			]),
			h('th', [
				h('span.dayLong', 'Sonntag'),
				h('span.dayShort', 'So'),
			]),
		])]),
		h('tbody', weeks),
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
	return [h('a', { id: 'later', href: `./calendar?origin=${data.input.origin.name}&destination=${data.input.destination.name}&${api.options.url(data.input).join('&')}&weeks=${weeks}&submit=Y#later` }, 'Mehr anzeigen...')]
}

const createTemplate = api => (data, error) => {
	const document = helpers.toHtmlString([
		head(api, data),
		h('body', [
			h('div#page', [
				h('div#header', [h('a', { href: './start', title: 'Preiskalender' }, [h('h1', 'Preiskalender')])]),
				h('div', { id: 'route', class: 'subtitle' }, [h('span', generateSubTitleRoute(data))]),
				h('div', { id: 'options', class: 'subtitle' }, generateSubTitleOptions(api, data)),
				calendar(api, data),
				h('div#more', moreLink(api, data)),
			]),
			h('div#footer', [
				h('a', { id: 'faq', href: './faq' }, 'FAQ'),
				h('span', ' – '),
				h('a', { id: 'impressum', href: './impressum' }, 'Rechtliches'),
			]),
		]),
	])
	return document
}

export default createTemplate
