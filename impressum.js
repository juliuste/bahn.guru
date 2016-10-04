'use strict'

const html = require('pithy')
const beautify = require('js-beautify').html

const head = () => {
	const elements = [
		html.meta({charset: 'utf-8'}),
		html.meta({name: 'viewport', content: "width=device-width, initial-scale=1.0, user-scalable=no"}),
		html.title(null, 'Impressum & Rechtliches | DB Preiskalender'),
		html.link({rel: 'stylesheet', type: 'text/css', href: 'assets/impressum.css'}),
	]
	return html.head(null, elements)
}

const generate = () => {
	let document = '<!doctype html>' + html.html(null, [
		head(),
		html.body(null, [
			html.div('#page', [
				html.h1('#title', 'Impressum & Rechtliches'),
				html.p(null, [html.a({href: 'mailto:bahnguru@juliuste.de'}, 'Julius Tens'), ', Schlickweg 10, 14129 Berlin.']),
				html.p(null, ['Dieses Projekt ist ', html.a({href: 'https://github.com/juliuste/bahn.guru/blob/master/LICENSE'}, 'MIT-Lizensiert'), '. Der Quellcode ist auf ', html.a({href: 'https://github.com/juliuste/bahn.guru'}, 'GitHub'), ' verfügbar.']),
				html.p(null, 'Alle Preisangaben unverbindlich und ohne Gewähr.')
			]),
			html.span('#preiskalender', [html.a({href: '/'}, 'Zurück zum Preiskalender')])
		])
	])
	return beautify(document)
}

module.exports = generate