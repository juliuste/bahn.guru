'use strict'

const html = require('pithy')
const settings = require('./api').settings
const apiName = require('../config').api

const formatPrice = (price) => {
	price = price.toFixed(2).toString().split('.')
	return { euros: price[0], cents: price[1] }
}

const opengraph = (extraTitle) => {
	let title = settings.ogTitle
	if (extraTitle) title += ` - ${extraTitle}`
	return [
		html.meta({ property: 'og:title', content: title }),
		html.meta({ property: 'og:description', content: settings.ogDescription }),
		html.meta({ property: 'og:image', content: settings.ogImage }),
		html.meta({ name: 'twitter:card', content: 'summary' })
	]
}

const staticHeader = () => [
	html.meta({ charset: 'utf-8' }),
	html.meta({ name: 'description', content: settings.description }),
	html.meta({ name: 'viewport', content: 'width=device-width, initial-scale=1.0' }),
	html.link({ rel: 'stylesheet', type: 'text/css', href: 'assets/styles/reset.css' }),
	html.link({ rel: 'stylesheet', type: 'text/css', href: 'assets/styles/base.css' }),
	html.link({ rel: 'stylesheet', type: 'text/css', href: `assets/styles/${apiName}.css` }),
	html.link({ rel: 'icon', type: 'image/png', href: `assets/${apiName}.png` })
]

module.exports = { formatPrice, opengraph, staticHeader }
