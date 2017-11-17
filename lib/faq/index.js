'use strict'

const html = require('pithy')
const beautify = require('js-beautify').html

const questions = [
	{
		title: 'Ist dies eine offizielle Website der Deutschen Bahn?',
		description: [
			'Nein, der Bahn-Guru ist ein momentan von der DB geduldetes Projekt ehrenamtlicher Open-Source-Softwareentwickler vom ',
			html.a({href: 'https://codefor.de/berlin/'}, 'OK Lab Berlin'),
			'. Alle Preisdaten sind daher unverbindlich, bitte überprüfen Sie Ihre Suchergebnisse auf der Website der ',
			html.a({href: 'http://bahn.de'}, 'Deutschen Bahn'),
			'.'
		]
	},
	{
		title: 'Woher stammen die Daten?',
		description: [
			'Diese Website nutzt eine ',
			html.a({href: 'https://github.com/juliuste/db-prices'}, 'inoffizielle Schnittstelle'),
			' der Deutschen Bahn. Kurzgefasst: Wie Scraping, nur mit weniger Aufwand und Traffic für alle Beteiligten.'
		]
	},
	{
		title: 'Verdient ihr mit dieser Website Geld?',
		description: 'Nein. Keine Werbung, keine Affiliate Links. Theoretisch macht diese Website wegen der (niedrigen) Serverkosten sogar ein Bisschen Verlust. Aber wir finden: Das ist es wert!'
	},
	{
		title: 'Warum keine Fernbuspreise?',
		description: 'Es wäre in der Tat spannend, auch einen Vergleich zu Fernbuspreisen anzubieten. Das wird jedoch leider mittelfristig nicht geschehen. Kurze Begründung: Wir trauen uns nicht. Längere Begründung: Wir existieren derzeit nur unter Duldung der Deutschen Bahn, da diese Website der DB nicht schadet und im besten Fall noch neue Kunden beschert. Listeten wir hier jedoch auch Fernbuspreise auf, könnte man uns ggf. vorwerfen, Kunden von der DB zur Konkurrenz zu treiben.'
	}
]


const head = () => {
	const elements = [
		html.meta({charset: 'utf-8'}),
		html.meta({name: 'viewport', content: "width=device-width, initial-scale=1.0"}),
		html.title(null, 'FAQ | Bahn-Preiskalender'),
		html.link({rel: 'stylesheet', type: 'text/css', href: 'assets/reset.css'}),
		html.link({rel: 'stylesheet', type: 'text/css', href: 'assets/base.css'}),
		html.link({rel: 'stylesheet', type: 'text/css', href: 'assets/faq.css'})
	]
	return html.head(null, elements)
}

const generate = () => {
	let document = '<!doctype html>' + html.html(null, [
		head(),
		html.body(null, [
			html.div('#page', [
				html.div('#header', [html.a({href: "/", title: "Preiskalender"}, [html.h1(null, 'Preiskalender')])]),
				html.h2(null, 'FAQ'),
				...questions.map((q) => html.div('.question', [
					html.h3(null, q.title),
					html.p('.description', q.description)
				]))
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
	res.end(generate())
}

module.exports = main
