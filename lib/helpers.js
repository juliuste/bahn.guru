'use strict'
const html = require('pithy')

const formatPrice = (price) => {
	price = price.toFixed(2).toString().split('.') 
	return {euros: price[0], cents: price[1]}
}

const openGraph = (extraTitle) => {
    let title = 'bahn.guru - der Bahn-Preiskalender';
    if (extraTitle) {
        title = `${title} - ${extraTitle}`
    }

    return [
        html.meta({property: 'og:title', content: title}),
        html.meta({property: 'og:description', content: 'Der Bahn-Guru hilft dir dabei, die günstigsten Sparpreise der Deutschen Bahn zu finden. 🚅'}),
        html.meta({property: 'og:image', content: 'https://bahn.guru/assets/screenshot.png'}),
        html.meta({name: 'twitter:card', content: 'summary'}),
    ]
}

module.exports = {formatPrice, openGraph}