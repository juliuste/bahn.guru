import html from 'pithy'
import jsBeautify from 'js-beautify'
import moment from 'moment-timezone'
import * as helpers from '../helpers.js'

const head = (api) => {
	const elements = [
		...helpers.staticHeader(api),
		html.title(null, (api.settings.greeting.title || 'Hinweis') + ' | ' + api.settings.title),
		...helpers.opengraph({ api, extraTitle: null }),
		html.link({ rel: 'stylesheet', type: 'text/css', href: '/assets/styles/greeting.css' }),
	]
	return html.head(null, elements)
}

const generate = api => {
	const document = '<!doctype html>' + html.html(null, [
		head(api),
		html.body(null, [
			html.div('#page', [
				// html.div('#header', [html.a({ href: './start', title: 'Preiskalender' }, [html.h1(null, 'Preiskalender')])]),
				html.div('.question', [
					...(api.settings.greeting.title ? [html.h3(null, api.settings.greeting.title)] : []),
					html.p('.description', api.settings.greeting.message),
				]),
				html.div('.continue', [
					html.p('.description', [
						html.a({ href: '/start' }, '→ weiter zum Kalender'),
					]),
				]),
			]),
			html.div('#footer', [
				html.a({ id: 'faq', href: './faq' }, 'FAQ'),
				html.span(null, ' – '),
				html.a({ id: 'impressum', href: './impressum' }, 'Rechtliches'),
			]),
		]),
	])
	return jsBeautify.html(document)
}

const createGreetingRoute = (api) => (req, res, next) => {
	if (!api.settings.greeting) return next()
	const day = moment.tz('Europe/Berlin').format('YYYY-MM-DD')
	if (api.settings.greeting.dates && !api.settings.greeting.dates.includes(day)) return next()
	res.send(generate(api))
}

export default createGreetingRoute
