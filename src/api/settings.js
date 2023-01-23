import { h } from 'hastscript'

const settings = {
	title: 'Bahn-Preiskalender',
	description: 'Der Bahn-Guru hilft dir dabei, die günstigsten Sparpreise der Deutschen Bahn zu finden. 🚅',
	analyticsId: '8b11a68a-f01c-4019-a4d2-1033ca10bc16',
	timezone: 'Europe/Berlin',
	scripts: ['./bundle/bahn.js'],
	styles: ['./bahn.css'],
	icon: './bahn.png',
	ogTitle: 'bahn.guru - der Bahn-Preiskalender',
	ogDescription: 'Der Bahn-Guru hilft dir dabei, die günstigsten Sparpreise der Deutschen Bahn zu finden. 🚅',
	ogImage: 'https://bahn.guru/assets/screenshot.png',
	originPlaceholder: 'Startbahnhof',
	destinationPlaceholder: 'Zielbahnhof',
	shopLinkTitle: 'zum Bahn-Shop',
	faq: [
		{
			title: 'Ist dies eine offizielle Website der Deutschen Bahn?',
			description: [
				'Nein, der Bahn-Guru ist ein momentan von der DB geduldetes Projekt ehrenamtlicher Open-Source-Softwareentwickler vom ',
				h('a', { href: 'https://codefor.de/berlin/' }, 'OK Lab Berlin'),
				'. Alle Preisdaten sind daher unverbindlich, bitte überprüfen Sie Ihre Suchergebnisse auf der Website der ',
				h('a', { href: 'http://bahn.de' }, 'Deutschen Bahn'),
				'.',
			],
		},
		{
			title: 'Woher stammen die Daten?',
			description: [
				'Diese Website nutzt eine ',
				h('a', { href: 'https://github.com/juliuste/db-prices' }, 'inoffizielle Schnittstelle'),
				' der Deutschen Bahn. Kurzgefasst: Wie Scraping, nur mit weniger Aufwand und Traffic für alle Beteiligten.',
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
		{
			title: 'Warum keine Fernbuspreise?',
			description: 'Es wäre in der Tat spannend, auch einen Vergleich zu Fernbuspreisen anzubieten. Das wird jedoch leider mittelfristig nicht geschehen. Kurze Begründung: Wir trauen uns nicht. Längere Begründung: Wir existieren derzeit nur unter Duldung der Deutschen Bahn, da diese Website der DB nicht schadet und im besten Fall noch neue Kunden beschert. Listeten wir hier jedoch auch Fernbuspreise auf, könnte man uns ggf. vorwerfen, Kunden von der DB zur Konkurrenz zu treiben.',
		},
	],
	greeting: null,
}
export default settings
