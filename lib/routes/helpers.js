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
		html.meta({ name: 'twitter:card', content: 'summary' }),
	]
}

const staticHeader = api => {
	const header = [
		html.meta({ charset: 'utf-8' }),
		html.meta({ name: 'description', content: api.settings.description }),
		html.meta({ name: 'viewport', content: 'width=device-width, initial-scale=1.0' }),
		html.link({ rel: 'stylesheet', type: 'text/css', href: '/assets/styles/reset.css' }),
		html.link({ rel: 'stylesheet', type: 'text/css', href: '/assets/styles/base.css' }),
		new html.SafeString(`
<!-- the following script is used for cookie-less, GDPR compliant analytics.
you can disable it at any time, e.g. using the NoScript or PrivacyBadger browser extensions,
and the website will still work 100% fine. as a privately maintained open-source project,
gaining some insights in how (much) this service is used is really good to stay motivated.
for more information on the analytics framework, which is completely open source, please
check https://umami.is/docs/faq -->
<script async defer data-website-id="1f42209c-055a-4a79-8a24-c3cb83955b67" src="https://developer.bahn.guru/umami.js"></script>`),
	]
	for (const style of api.settings.styles) { header.push(html.link({ rel: 'stylesheet', type: 'text/css', href: resolve('/assets/styles/', style) })) }

	if (api.settings.icon) { header.push(html.link({ rel: 'icon', type: 'image/png', href: resolve('/assets/', api.settings.icon) })) }

	return header
}

const helpers = {
	formatPrice,
	opengraph,
	staticHeader,
}

module.exports = helpers
