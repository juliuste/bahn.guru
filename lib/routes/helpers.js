'use strict'

const html = require('pithy')
// eslint-disable-next-line node/no-deprecated-api
const { resolve } = require('url')

const formatPrice = price => {
	price = price.toFixed(2).toString().split('.')
	return { euros: price[0], cents: price[1] }
}

const opengraph = ({ api, extraTitle }) => {
	let title = api.settings.ogTitle
	if (extraTitle) title += ` - ${extraTitle}`
	return [
		html.meta({ property: 'og:title', content: title }),
		html.meta({ property: 'og:description', content: api.settings.ogDescription }),
		html.meta({ property: 'og:image', content: api.settings.ogImage }),
		html.meta({ name: 'twitter:card', content: 'summary' })
	]
}

const staticHeader = api => {
	const header = [
		html.meta({ charset: 'utf-8' }),
		html.meta({ name: 'description', content: api.settings.description }),
		html.meta({ name: 'viewport', content: 'width=device-width, initial-scale=1.0' }),
		html.link({ rel: 'stylesheet', type: 'text/css', href: 'assets/styles/reset.css' }),
		html.link({ rel: 'stylesheet', type: 'text/css', href: 'assets/styles/base.css' })
	]
	for (let style of api.settings.styles) { header.push(html.link({ rel: 'stylesheet', type: 'text/css', href: resolve('assets/styles/', style) })) }

	if (api.settings.icon) { header.push(html.link({ rel: 'icon', type: 'image/png', href: resolve('assets/', api.settings.icon) })) }

	return header
}

const helpers = {
	formatPrice,
	opengraph,
	staticHeader
}

module.exports = helpers
