import { h } from 'hastscript'
import * as helpers from '../helpers.js'

const head = (api) => {
	const elements = [
		...helpers.staticHeader(api),
		h('title', 'FAQ | ' + api.settings.title),
		...helpers.opengraph({ api, extraTitle: null }),
		h('link', { rel: 'stylesheet', type: 'text/css', href: '/assets/styles/faq.css' }),
	]
	return h('head', elements)
}

const generate = api => {
	const document = helpers.toHtmlString([
		head(api),
		h('body', [
			h('div#page', [
				h('div#header', [h('a', { href: './start', title: 'Preiskalender' }, [h('h1', 'Preiskalender')])]),
				h('h2', 'FAQ'),
				...api.settings.faq.map((q) => h('div.question', [
					h('h3', q.title),
					h('p.description', q.description),
				])),
			]),
			h('div#footer', [
				h('a', { id: 'faq', href: './faq' }, 'FAQ'),
				h('span', ' – '),
				h('a', { id: 'impressum', href: './impressum' }, 'Rechtliches'),
			]),
		]),
	])
	return document
}

const createFaqRoute = (api) => (req, res, next) => {
	res.send(generate(api))
}

export default createFaqRoute
