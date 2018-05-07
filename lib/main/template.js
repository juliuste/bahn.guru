'use strict'

const html = require('pithy')
const beautify = require('js-beautify').html
const options = require('../api').options
const helpers = require('../helpers')
const settings = require('../api').settings

const head = () => {
	const elements = [
		...helpers.staticHeader(),
		html.title(null, settings.title),
		...helpers.opengraph(),
		html.link({rel: 'stylesheet', type: 'text/css', href: 'assets/styles/main.css'}),
		html.link({rel: 'stylesheet', type: 'text/css', href: 'assets/styles/autocomplete.css'})
	]
	return html.head(null, elements)
}

const errorBox = (params) => {
	if(params.error) return html.div({id: 'error', class: 'subtitle'}, [html.span(null, params.error)])
	return []
}

const generate = (params) => {
	let document = '<!doctype html>' + html.html(null, [
		head(),
		html.body(null, [
			html.form({id: 'page', action: '/calendar', method: 'GET'}, [
				html.div('#header', [html.h1(null, 'Preiskalender')]),
				errorBox(params),
				html.div('#form', [
					html.div({id: 'origin', class: 'station'}, [html.span(null, 'Ab'), html.input({id: 'originInput', name: 'origin', type: 'text', value: (params.origin) ? params.origin.name : '', placeholder: settings.originPlaceholder, size: 1})]),
					html.div({id: 'destination', class: 'station'}, [html.span(null, 'An'), html.input({id: 'destinationInput', name: 'destination', type: 'text', value: (params.destination) ? params.destination.name : '', placeholder: settings.destinationPlaceholder, size: 1})]),
					html.div('#go', [html.input({id: 'submit', name: 'submit', type: 'submit', value: 'Suchen'})])
				]),
				html.div('#options', options.input(params))
			]),
			html.div('#footer', [
				html.a({id: 'faq', href: '/faq'}, 'FAQ'),
				html.span(null, ' – '),
				html.a({id: 'impressum', href: '/impressum'}, 'Rechtliches')
			]),
			html.script({src: 'assets/scripts/bundle.js'})
		])
	])
	return beautify(document)
}

module.exports = generate
