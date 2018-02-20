'use strict'
const html = require('pithy')
const settings = require('./api').settings

const formatPrice = (price) => {
	price = price.toFixed(2).toString().split('.')
	return {euros: price[0], cents: price[1]}
}

const openGraph = (extraTitle) => {
	let title = settings.ogTitle
    if(extraTitle) title += ` - ${extraTitle}`
    return [
        html.meta({property: 'og:title', content: title}),
        html.meta({property: 'og:description', content: settings.ogDescription}),
        html.meta({property: 'og:image', content: settings.ogImage}),
        html.meta({name: 'twitter:card', content: 'summary'}),
    ]
}

module.exports = {formatPrice, openGraph}
