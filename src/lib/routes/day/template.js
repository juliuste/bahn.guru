import { h } from 'hastscript'
import moment from 'moment-timezone'
// eslint-disable-next-line no-unused-vars
import mdf from 'moment-duration-format'
import sort from 'lodash/sortBy.js'
import tail from 'lodash/tail.js'
import reverse from 'lodash/reverse.js'
import * as helpers from '../helpers.js'

const productIndex = ['Bus', 'BUS', 'RB', 'RE', 'IRE', 'IC', 'IEC', 'EC', 'ICE']

const head = (api, data) => {
	const title = generateSubTitleRoute(data).join('') + ' | Tagesansicht'
	const elements = [
		...helpers.staticHeader(api),
		h('title', `${title} | ${api.settings.title}`),
		...helpers.opengraph({ api, extraTitle: title }),
		h('link', { rel: 'stylesheet', type: 'text/css', href: '/assets/styles/day.css' }),
	]
	return h('head', elements)
}

const generateProducts = (legs) => {
	if (!legs) return null
	const result = []
	for (const leg of legs) {
		const product = leg.line?.productName
		if (result.indexOf(product) < 0) { result.push(product) }
	}
	return reverse(sort(result, (x) => productIndex.indexOf(x)))
}

const collectVias = (journey) => {
	if (journey.legs.length <= 1) return ['–']
	const vias = []
	for (const leg of journey.legs) {
		if (leg !== journey.legs[journey.legs.length - 1]) vias.push(leg.destination.name, h('br'))
	}
	vias.pop()
	return vias
}

const parseJourney = (api, params) => (journey) => {
	journey.duration = +new Date(journey.legs[journey.legs.length - 1].plannedArrival) - (+new Date(journey.legs[0].plannedDeparture))
	let formattedDuration = moment.duration(journey.duration).format('h:mm')
	if (formattedDuration.split(':').length <= 1) formattedDuration = '0:' + formattedDuration
	return {
		plannedDeparture: moment(journey.legs[0].plannedDeparture).tz(api.settings.timezone).format('HH:mm'),
		plannedArrival: moment(journey.legs[journey.legs.length - 1].plannedArrival).tz(api.settings.timezone).format('HH:mm'),
		origin: params.origin.name,
		destination: params.destination.name,
		products: generateProducts(journey.legs),
		transfers: journey.legs.length - 1,
		price: journey.formattedPrice,
		rawPrice: journey.price.amount,
		rawDuration: moment.duration(journey.duration).format('m'),
		hourDuration: moment.duration(journey.duration).format('h'),
		duration: formattedDuration,
		cheapest: journey.cheapest,
		via: collectVias(journey),
		link: api.shopLink(params.origin, params.destination, moment(journey.legs[0].plannedDeparture).tz(api.settings.timezone), journey, params) || '#',
	}
}

const products = (journey) => {
	if (journey.products && journey.products.length > 0) {
		if (journey.products.length === 1) return [journey.products[0]]
		return [journey.products[0], h('span.columnLong', [', ', ...tail(journey.products).join(', ')])]
	}
	return ['–']
}

const price = (journey) => [
	h('span.columnLong', journey.price.euros + ',' + journey.price.cents + '€'),
	h('span.columnShort', Math.round(+journey.price.euros + (+journey.price.cents / 100)) + '€'),
]

const cheapestClass = (journey) => {
	return (journey.cheapest) ? { class: 'cheapest' } : null
}

const journeyTable = (api, data) => {
	if (!data) return h('span')
	const head = h('thead', [h('tr', [
		h('th', [
			h('span.columnLong', 'Abfahrt'),
			h('span.columnShort', 'Ab'),
		]),
		h('th', [
			h('span.columnLong', 'Ankunft'),
			h('span.columnShort', 'An'),
		]),
		h('th', [
			h('span.columnLong', 'Dauer'),
			h('span.columnShort', 'Zeit'),
		]),
		h('th.changes', [
			h('span.columnLong', 'Umstiege'),
			h('span.columnShort', '⇔'),
		]),
		h('th.columnMiddle', 'Via'),
		h('th', [
			h('span.columnLong', 'Typen'),
			h('span.columnShort', 'Typ'),
		]),
		h('th', 'Preis'),
	])])
	const rows = []
	let journeys = data.output.map(parseJourney(api, data.input))
	journeys = sort(journeys, ['rawPrice', 'rawDuration'])
	for (const journey of journeys) {
		rows.push([h('tr', cheapestClass(journey), [
			h('td', [
				journey.plannedDeparture,
				h('span.columnLong', ' Uhr'),
			]),
			h('td', [
				journey.plannedArrival,
				h('span.columnLong', ' Uhr'),
			]),
			h('td', [
				h('span.columnLong', journey.duration),
				h('span.columnShort', journey.hourDuration + 'h'),
			]),
			h('td.changes', '' + journey.transfers),
			h('td', { class: 'via columnMiddle' }, journey.via),
			h('td', products(journey)),
			h('td.price', [h('a', { href: journey.link, title: api.settings.shopLinkTitle }, price(journey))]),
		])])
	}
	return h('table#journeys', [head, h('tbody', rows)])
}

const generateSubTitleDate = (data) => {
	const date = data.input.date
	return [
		h('span', date.format('DD.MM.YYYY')),
	]
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

const createTemplate = api => data => {
	const document = helpers.toHtmlString([
		head(api, data),
		h('body', [
			h('div#page', [
				h('div#header', [h('a', { href: './start', title: 'Preiskalender' }, [h('h1', 'Preiskalender')])]),
				h('div', { class: 'subtitle' }, [h('span', generateSubTitleRoute(data))]),
				h('div', { id: 'date', class: 'subtitle' }, generateSubTitleDate(data)),
				h('div', { id: 'options', class: 'subtitle' }, generateSubTitleOptions(api, data)),
				journeyTable(api, data),
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
