'use strict'

const html = require('pithy')
const beautify = require('js-beautify').html
const helpers = require('../helpers')

const head = (api) => {
	const elements = [
		...helpers.staticHeader(api),
		html.title(null, 'FAQ | ' + api.settings.title),
		...helpers.opengraph({ api, extraTitle: null }),
		html.link({ rel: 'stylesheet', type: 'text/css', href: '/assets/styles/faq.css' })
	]
	return html.head(null, elements)
}

const generate = api => {
	let document = '<!doctype html>' + html.html(null, [
		head(api),
		html.body(null, [
			html.div('#page', [
				html.div('#header', [html.a({ href: './start', title: 'Preiskalender' }, [html.h1(null, 'Preiskalender')])]),
				html.h2(null, 'FAQ'),
				...api.settings.faq.map((q) => html.div('.question', [
					html.h3(null, q.title),
					html.p('.description', q.description)
				]))
			]),
			html.div('#footer', [
				html.a({ id: 'faq', href: './faq' }, 'FAQ'),
				html.span(null, ' – '),
				html.a({ id: 'impressum', href: './impressum' }, 'Rechtliches')
			])
		])
	])
	return beautify(document)
}

const createFaqRoute = (api) => (req, res, next) => {
	res.send(generate(api))
}

module.exports = createFaqRoute
