'use strict'

const html = require('pithy')

module.exports = {
	title: 'Bahn-Preiskalender',
	description: 'Der Bahn-Guru hilft dir dabei, die günstigsten Sparpreise der Deutschen Bahn zu finden. 🚅',
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
				html.a({ href: 'https://codefor.de/berlin/' }, 'OK Lab Berlin'),
				'. Alle Preisdaten sind daher unverbindlich, bitte überprüfen Sie Ihre Suchergebnisse auf der Website der ',
				html.a({ href: 'http://bahn.de' }, 'Deutschen Bahn'),
				'.'
			]
		},
		{
			title: 'Woher stammen die Daten?',
			description: [
				'Diese Website nutzt eine ',
				html.a({ href: 'https://github.com/juliuste/db-prices' }, 'inoffizielle Schnittstelle'),
				' der Deutschen Bahn. Kurzgefasst: Wie Scraping, nur mit weniger Aufwand und Traffic für alle Beteiligten.'
			]
		},
		{
			title: 'Wo finde ich den Quellcode?',
			description: [
				'Der ',
				html.a({ href: 'https://github.com/juliuste/bahn.guru/blob/master/license' }, 'ISC-lizenzierte'),
				' Quellcode kann auf ',
				html.a({ href: 'https://github.com/juliuste/bahn.guru' }, 'GitHub'),
				' abgerufen werden.'
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
	],
	greeting: { // can be null
		dates: ['2021-01-27'],
		title: '76. Jahrestag der Befreiung des deutschen Vernichtungslagers Auschwitz-Birkenau',
		message: [
			html.br(),
			'Am 27. Januar 1945 befreite die Rote Armee das deutsche Konzentrations- und Vernichtungslager Auschwitz-Birkenau, Schauplatz des größten Verbrechens der Menschheitsgeschichte. Die Ermordung der europäischen Juden (Shoah), der Sinti und Roma (Porajmos), Homosexuellen, Zeugen Jehovas und Millionen weiterer Menschen, insbesondere aus Osteuropa, wäre ohne die logistische Organisation durch die willfährige deutsche Reichsbahn nicht möglich gewesen.',
			html.br(),
			html.br(),
			'Wenngleich die meisten Deutschen heute keine Schuld an den ungeheuerlichen Verbrechen tragen, die im dunkelsten Kapitel unserer Geschichte im Namen dieses Landes begangen und von einem großen Teil seiner Bevölkerung mitgetragen wurden, ist es unsere Pflicht, die Erinnerung an das Geschehene zu bewahren und auf die historische Verantwortung unseres Staates sowie beteiligter Organisationen hinzuweisen.',
			html.br(),
			html.br(),
			'Als ehrenamtliche Betreiber dieser Seite, die zwar offiziell nicht mit der Deutschen Bahn assoziiert ist, aber doch in gewisser Hinsicht als (kleiner) Teil ihres erweiterten Ökosystems gesehen werden kann, hoffen wir, dass die DB als Nachfolgerin der deutschen Reichsbahn zu dieser historischen Verantwortung steht.'
		]
	}
}
