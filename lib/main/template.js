'use strict'

const html = require('pithy')
const beautify = require('js-beautify').html
const options = require('../api').options
const opengraph = require('../helpers').openGraph


const head = () => {
	const elements = [
		html.meta({charset: 'utf-8'}),
		html.meta({name: 'viewport', content: "width=device-width, initial-scale=1.0"}),
		html.title(null, 'Bahn-Preiskalender'),
		...opengraph(),
		html.link({rel: 'stylesheet', type: 'text/css', href: 'assets/reset.css'}),
		html.link({rel: 'stylesheet', type: 'text/css', href: 'assets/base.css'}),
		html.link({rel: 'stylesheet', type: 'text/css', href: 'assets/main.css'}),
		html.link({rel: 'stylesheet', type: 'text/css', href: 'assets/autocomplete.css'}),
		html.link({rel: 'stylesheet', type: 'text/css', href: 'assets/'+require('config').api+'.css'})
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
					html.div({id: 'origin', class: 'station'}, [html.span(null, 'Ab'), html.input({id: 'from', name: 'from', type: 'text', value: (params.from) ? params.from.name : '', placeholder: 'Startbahnhof', size: 1})]),
					html.div({id: 'destination', class: 'station'}, [html.span(null, 'An'), html.input({id: 'to', name: 'to', type: 'text', value: (params.to) ? params.to.name : '', placeholder: 'Zielbahnhof', size: 1})]),
					html.div('#go', [html.input({id: 'submit', name: 'submit', type: 'submit', value: 'Suchen'})])
				]),
				html.div('#options', options.input(params))
			]),
			html.div('#footer', [
				html.a({id: 'faq', href: '/faq'}, 'FAQ'),
				html.span(null, ' – '),
				html.a({id: 'impressum', href: '/impressum'}, 'Rechtliches')
			]),
			html.script({src: 'assets/bundle.js'})
		])
	])
	return beautify(document)
}

module.exports = generate
