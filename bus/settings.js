'use strict'

const html = require('pithy')

module.exports = {
    title: 'Bus-Preiskalender',
    ogTitle: 'bus.bahn.guru - der Bus-Preiskalender',
    ogDescription: 'Der Bahn-Guru für Busse hilft dir dabei, die günstigsten Sparpreise von Flixbus/Meinfernbus zu finden. 🚌',
    ogImage: 'https://bahn.guru/assets/screenshot.png',
    originPlaceholder: 'Start',
    destinationPlaceholder: 'Ziel',
    shopLinkTitle: 'zum Flixbus-Shop',
    faq: [
        {
    		title: 'Ist dies eine offizielle Website von Flixbus?',
    		description: [
    			'Nein, der Bahn-Guru für Busse ist ein Projekt ehrenamtlicher Open-Source-Softwareentwickler vom ',
    			html.a({href: 'https://codefor.de/berlin/'}, 'OK Lab Berlin'),
    			'. Alle Preisdaten sind daher unverbindlich, bitte überprüfen Sie Ihre Suchergebnisse auf der Website von ',
    			html.a({href: 'https://flixbus.de'}, 'Flixbus'),
    			'.'
    		]
    	},
    	{
    		title: 'Woher stammen die Daten?',
    		description: [
    			'Diese Website nutzt eine ',
    			html.a({href: 'https://github.com/juliuste/meinfernbus'}, 'inoffizielle Schnittstelle'),
    			' von Flixbus/Meinfernbus. Kurzgefasst: Wie Scraping, nur mit weniger Aufwand und Traffic für alle Beteiligten.'
    		]
    	},
    	{
    		title: 'Verdient ihr mit dieser Website Geld?',
    		description: 'Nein. Keine Werbung, keine Affiliate Links. Theoretisch macht diese Website wegen der (niedrigen) Serverkosten sogar ein Bisschen Verlust. Aber wir finden: Das ist es wert!'
    	}
    ]
}
