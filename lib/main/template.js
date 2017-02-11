'use strict'

const html = require('pithy')
const beautify = require('js-beautify').html
const options = require('../api').options

const head = () => {
	const elements = [
		html.meta({charset: 'utf-8'}),
		html.meta({name: 'viewport', content: "width=device-width, initial-scale=1.0, user-scalable=no"}),
		html.title(null, 'DB Preiskalender'),
		html.link({rel: 'stylesheet', type: 'text/css', href: 'assets/general.css'}),
		html.link({rel: 'stylesheet', type: 'text/css', href: 'assets/main.css'}),
		html.link({rel: 'stylesheet', type: 'text/css', href: 'assets/autocomplete.css'}),
		html.link({rel: 'stylesheet', type: 'text/css', href: 'assets/'+require('config').api+'.css'})
	]
	return html.head(null, elements)
}

const errorBox = (params) => {
	if(params.error) return html.p('#error', params.error)
	return []
}

const generate = (params) => {
	let document = '<!doctype html>' + html.html(null, [
		head(),
		html.body(null, [
			html.div('#page', [
				html.h1('#title', 'Preiskalender'),
				errorBox(params),
				html.form({id: 'form', action: '/calendar', method: 'GET'}, [
					html.div('#route', [
						html.div({id: 'fromContainer', class: 'stationContainer'}, [html.input({id: 'from', class: 'station', name: 'from', type: 'text', value: (params.from) ? params.from.name : '', placeholder: 'Startbahnhof'})]),
						html.span('#arrow', '→'),
						html.div({id: 'toContainer', class: 'stationContainer'}, [html.input({id: 'to', class: 'station', name: 'to', type: 'text', value: (params.to) ? params.to.name : '', placeholder: 'Zielbahnhof'})]),
						html.input({id: 'submit', name: 'submit', type: 'submit', value: '↳'}),
					]),
					html.div('#options', options.input(params))
				])
			]),
			html.span('#footer', [html.a({href: '/impressum'}, 'Impressum & Rechtliches')]),
			html.script({src: 'assets/bundle.js'})
		])
	])
	return beautify(document)
}

module.exports = generate