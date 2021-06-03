import { h } from 'hastscript'
import * as helpers from '../helpers.js'

const head = (api) => {
	const elements = [
		...helpers.staticHeader(api),
		h('title', 'Rechtliches | ' + api.settings.title),
		...helpers.opengraph({ api, extraTitle: null }),
		h('link', { rel: 'stylesheet', type: 'text/css', href: '/assets/styles/impressum.css' }),
	]
	return h('head', elements)
}

const generate = (api) => {
	const document = helpers.toHtmlString([
		head(api),
		h('body', [
			h('div#page', [
				h('div#header', [h('a', { href: './start', title: 'Preiskalender' }, [h('h1', 'Preiskalender')])]),
				h('h2', 'Impressum & Datenschutz'),
				h('div', { class: 'section' }, [
					h('p', [
						h('a', { href: 'https://juliustens.eu' }, 'Julius Tens'),
						', ',
						h('a', { href: 'mailto:bahnguru@juliustens.eu' }, 'bahnguru@juliustens.eu'),
						', Schlickweg 10, 14129 Berlin.',
					]),
				]),
				h('div', { class: 'section' }, [
					h('p', [
						'Dieses Projekt ist ',
						h('a', { href: 'https://github.com/juliuste/bahn.guru/blob/main/license' }, 'ISC-lizenziert'),
						'. Der Quellcode ist auf ',
						h('a', { href: 'https://github.com/juliuste/bahn.guru' }, 'GitHub'),
						' verfügbar.',
					]),
				]),
				h('div', { class: 'section' }, [
					h('p', 'Alle Preisangaben unverbindlich und ohne Gewähr.'),
				]),
				h('div', { class: 'section' }, [
					h('p', 'Es werden keine personenbezogenen Daten gespeichert. Für Verbindungsanfragen werden Start- und Zielpunkt, sowie gewählte Optionen (Reisedauer, Anzahl der Umstiege, etc.), anonymisiert an das Verkehrsunternehmen geschickt. Ansonsten erfolgt keine Weitergabe von Daten an Dritte.'),
				]),
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

const createImpressumRoute = (api) => (req, res, next) => {
	res.send(generate(api))
}

export default createImpressumRoute
