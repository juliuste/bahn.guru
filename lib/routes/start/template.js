import html from 'pithy'
import jsBeautify from 'js-beautify'
// eslint-disable-next-line node/no-deprecated-api
import { resolve } from 'url'
import * as helpers from '../helpers.js'

const head = api => {
	const elements = [
		...helpers.staticHeader(api),
		html.title(null, api.settings.title),
		...helpers.opengraph({ api, extraTitle: null }),
		html.link({ rel: 'stylesheet', type: 'text/css', href: '/assets/styles/main.css' }),
		html.link({ rel: 'stylesheet', type: 'text/css', href: '/assets/styles/autocomplete.css' }),
	]
	return html.head(null, elements)
}

const errorBox = (error) => {
	if (error && error.message) return html.div({ id: 'error', class: 'subtitle' }, [html.span(null, error.message)])
	return []
}

const createTemplate = api => ({ params, error }) => {
	if (!params) params = {}
	const body = [
		html.form({ id: 'page', action: './calendar', method: 'GET' }, [
			html.div('#header', [html.h1(null, 'Preiskalender')]),
			errorBox(error),
			html.div('#form', [
				html.div({ id: 'origin', class: 'station' }, [html.span(null, 'Ab'), html.input({ id: 'originInput', name: 'origin', type: 'text', value: (params.origin) ? params.origin.name : '', placeholder: api.settings.originPlaceholder, size: 1 })]),
				html.div({ id: 'destination', class: 'station' }, [html.span(null, 'An'), html.input({ id: 'destinationInput', name: 'destination', type: 'text', value: (params.destination) ? params.destination.name : '', placeholder: api.settings.destinationPlaceholder, size: 1 })]),
				html.div('#go', [html.input({ id: 'submit', name: 'submit', type: 'submit', value: 'Suchen' })]),
			]),
			html.div('#options', api.options.input(params)),
		]),
		html.div('#footer', [
			html.a({ id: 'faq', href: './faq' }, 'FAQ'),
			html.span(null, ' – '),
			html.a({ id: 'impressum', href: './impressum' }, 'Rechtliches'),
		]),
	]

	for (const script of api.settings.scripts) { body.push(html.script({ src: resolve('/assets/scripts/', script) })) }

	const document = '<!doctype html>' + html.html(null, [
		head(api),
		html.body(null, body),
	])
	return jsBeautify.html(document)
}

export default createTemplate
