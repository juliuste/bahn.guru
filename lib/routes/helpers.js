import { h } from 'hastscript'
import { u } from 'unist-builder'
import { toHtml } from 'hast-util-to-html'
import jsBeautify from 'js-beautify'
// eslint-disable-next-line node/no-deprecated-api
import { resolve } from 'url'

const useUmami = process.env.ANALYTICS === 'true'

export const formatPrice = price => {
	price = price.toFixed(2).toString().split('.')
	return { euros: price[0], cents: price[1] }
}

export const opengraph = ({ api, extraTitle }) => {
	let title = api.settings.ogTitle
	if (extraTitle) title += ` - ${extraTitle}`
	return [
		h('meta', { property: 'og:title', content: title }),
		h('meta', { property: 'og:description', content: api.settings.ogDescription }),
		h('meta', { property: 'og:image', content: api.settings.ogImage }),
		h('meta', { name: 'twitter:card', content: 'summary' }),
	]
}

export const staticHeader = api => {
	const header = [
		h('meta', { charset: 'utf-8' }),
		h('meta', { name: 'description', content: api.settings.description }),
		h('meta', { name: 'viewport', content: 'width=device-width, initial-scale=1.0' }),
		h('link', { rel: 'stylesheet', type: 'text/css', href: '/assets/styles/reset.css' }),
		h('link', { rel: 'stylesheet', type: 'text/css', href: '/assets/styles/base.css' }),
		...(useUmami
			? [
				u('comment', `the following script is used for cookie-less, GDPR compliant analytics.
you can disable it at any time, e.g. using the NoScript or PrivacyBadger browser extensions,
and the website will still work 100% fine. as a privately maintained open-source project,
gaining some insights in how (much) this service is used is really good to stay motivated.
for more information on the analytics framework, which is completely open source, please
check https://umami.is/docs/faq`),
				h('script', { async: true, defer: true, 'data-website-id': api.settings.analyticsId, src: 'https://developer.bahn.guru/umami.js' }),
			]
			: []),
	]
	for (const style of api.settings.styles) { header.push(h('link', { rel: 'stylesheet', type: 'text/css', href: resolve('/assets/styles/', style) })) }

	if (api.settings.icon) { header.push(h('link', { rel: 'icon', type: 'image/png', href: resolve('/assets/', api.settings.icon) })) }

	return header
}

export const toHtmlString = (e) => jsBeautify.html(toHtml(h(undefined, u('doctype'), h('html', e))))
