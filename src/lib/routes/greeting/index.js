import { h } from 'hastscript'
// import moment from 'moment-timezone'
import * as helpers from '../helpers.js'

const head = (api) => {
	const elements = [
		...helpers.staticHeader(api),
		h('title', (api.settings.greeting.title || 'Hinweis') + ' | ' + api.settings.title),
		...helpers.opengraph({ api, extraTitle: null }),
		h('link', { rel: 'stylesheet', type: 'text/css', href: '/assets/styles/greeting.css' }),
	]
	return h('head', elements)
}

const generate = api => {
	const document = helpers.toHtmlString([
		head(api),
		h('body', [
			h('div#page', [
				// h('div#header', [h('a', { href: './start', title: 'Preiskalender' }, [h('h1', 'Preiskalender')])]),
				h('div.question', [
					...(api.settings.greeting.title ? [h('h2', api.settings.greeting.title)] : []),
					...api.settings.greeting.elements,
				]),
				// h('div.continue', [
				// 	h('p.description', [
				// 		h('a', { href: '/start' }, '→ weiter zum Kalender'),
				// 	]),
				// ]),
			]),
			h('div#footer', [
				// h('a', { id: 'faq', href: './faq' }, 'FAQ'),
				// h('span', ' – '),
				h('a', { id: 'impressum', href: './impressum' }, 'Rechtliches'),
			]),
		]),
	])
	return document
}

const createGreetingRoute = (api) => (req, res, next) => {
	if (!api.settings.greeting) return next()
	// const day = moment.tz('Europe/Berlin').format('YYYY-MM-DD')
	// if (api.settings.greeting.dates && !api.settings.greeting.dates.includes(day)) return next()
	res.send(generate(api))
}

export default createGreetingRoute
