'use strict'

const html = require('pithy')
const beautify = require('js-beautify').html
const opengraph = require('../helpers').openGraph

const head = () => {
	const elements = [
		html.meta({charset: 'utf-8'}),
		html.meta({name: 'viewport', content: "width=device-width, initial-scale=1.0"}),
		html.title(null, 'Rechtliches | Bahn-Preiskalender'),
        ...opengraph(),
        html.link({rel: 'stylesheet', type: 'text/css', href: 'assets/reset.css'}),
		html.link({rel: 'stylesheet', type: 'text/css', href: 'assets/base.css'}),
		html.link({rel: 'stylesheet', type: 'text/css', href: 'assets/impressum.css'})
	]
	return html.head(null, elements)
}

const generate = () => {
	let document = '<!doctype html>' + html.html(null, [
		head(),
		html.body(null, [
			html.div('#page', [
				html.div('#header', [html.a({href: "/", title: "Preiskalender"}, [html.h1(null, 'Preiskalender')])]),
				html.h2(null, 'Impressum'),
				html.div({class: 'section'}, [
					html.p(null, [
						html.a({href: "https://juliustens.eu"}, "Julius Tens"),
						', ',
						html.a({href: "mailto:bahnguru@juliustens.eu"}, 'bahnguru@juliuste.de'),
						', Schlickweg 10, 14129 Berlin.'
					])
				]),
				html.div({class: 'section'}, [
					html.p(null, [
						'Dieses Projekt ist ',
						html.a({href: "https://github.com/juliuste/bahn.guru/blob/master/LICENSE"}, "MIT-lizenziert"),
						'. Der Quellcode ist auf ',
						html.a({href: "https://github.com/juliuste/bahn.guru"}, 'GitHub'),
						' verfügbar.'
					])
				]),
				html.div({class: 'section'}, [
					html.p(null, 'Alle Preisangaben unverbindlich und ohne Gewähr.')
				])
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

const main = (req, res, next) => {
	res.send(generate())
}

module.exports = main
