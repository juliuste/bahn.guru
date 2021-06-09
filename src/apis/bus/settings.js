import { h } from 'hastscript'

const settings = {
	title: 'Bus-Preiskalender',
	description: 'Der Preiskalender für Busse hilft dir dabei, die günstigsten Sparpreise von Flixbus/Meinfernbus zu finden. 🚌',
	analyticsId: '167a5d7c-878f-405e-afd9-a6aa84507114',
	timezone: 'Europe/Berlin',
	scripts: ['./bundle/bus.js'],
	styles: ['./bus.css'],
	icon: './bus.png',
	ogTitle: 'bus.transit.cheap - der Bus-Preiskalender',
	ogDescription: 'Der Preiskalender für Busse hilft dir dabei, die günstigsten Sparpreise von Flixbus/Meinfernbus zu finden. 🚌',
	ogImage: 'https://bahn.guru/assets/screenshot.png',
	originPlaceholder: 'Start',
	destinationPlaceholder: 'Ziel',
	shopLinkTitle: 'zum Flixbus-Shop',
	faq: [
		{
			title: 'Ist dies eine offizielle Website von Flixbus?',
			description: [
				'Nein, der Bahn-Guru für Busse ist ein Projekt ehrenamtlicher Open-Source-Softwareentwickler vom ',
				h('a', { href: 'https://codefor.de/berlin/' }, 'OK Lab Berlin'),
				'. Alle Preisdaten sind daher unverbindlich, bitte überprüfen Sie Ihre Suchergebnisse auf der Website von ',
				h('a', { href: 'https://flixbus.de' }, 'Flixbus'),
				'.',
			],
		},
		{
			title: 'Woher stammen die Daten?',
			description: [
				'Diese Website nutzt eine ',
				h('a', { href: 'https://github.com/juliuste/flix' }, 'inoffizielle Schnittstelle'),
				' von Flixbus/Meinfernbus. Kurzgefasst: Wie Scraping, nur mit weniger Aufwand und Traffic für alle Beteiligten.',
			],
		},
		{
			title: 'Wo finde ich den Quellcode?',
			description: [
				'Der ',
				h('a', { href: 'https://github.com/juliuste/bahn.guru/blob/main/license' }, 'ISC-lizenzierte'),
				' Quellcode kann auf ',
				h('a', { href: 'https://github.com/juliuste/bahn.guru' }, 'GitHub'),
				' abgerufen werden.',
			],
		},
		{
			title: 'Verdient ihr mit dieser Website Geld?',
			description: 'Nein. Keine Werbung, keine Affiliate Links. Theoretisch macht diese Website wegen der (niedrigen) Serverkosten sogar ein Bisschen Verlust. Aber wir finden: Das ist es wert!',
		},
	],
	greeting: null,
}
export default settings
