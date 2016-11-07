'use strict'

const html = require('pithy')
const beautify = require('js-beautify').html

const head = () => {
	const elements = [
		html.meta({charset: 'utf-8'}),
		html.meta({name: 'viewport', content: "width=device-width, initial-scale=1.0, user-scalable=no"}),
		html.title(null, 'DB Preiskalender'),
		html.link({rel: 'stylesheet', type: 'text/css', href: 'assets/general.css'}),
		html.link({rel: 'stylesheet', type: 'text/css', href: 'assets/main.css'}),
		html.link({rel: 'stylesheet', type: 'text/css', href: 'assets/autocomplete.css'})
	]
	return html.head(null, elements)
}

const option = (value, text, checked) => {
	const opt = {value: value}
	if(checked) opt.selected = true
	return html.option(opt, text)
}

const errorBox = (params) => {
	if(params.error) return html.p('#error', params.error)
	return []
}

const generate = (params) => {
	const defaults = {
		weeks: 4,
		class: 2,
		bc: 0,
		duration: null,
		start: null,
		end: null,
		error: null
	}
	if(params) params.set = true
	params = Object.assign(defaults, params)

	let document = '<!doctype html>' + html.html(null, [
		head(),
		html.body(null, [
			html.div('#page', [
				html.h1('#title', 'Preiskalender'),
				errorBox(params),
				html.form({id: 'form', action: '/calendar', method: 'GET'}, [
					html.div('#route', [
						html.input({id: 'from', class: 'station', name: 'from', type: 'text', value: (params.from) ? params.from.name : '', placeholder: 'Startbahnhof'}),
						html.input({id: 'from-id', name: 'fromID', type: 'hidden', value: (params.from) ? params.from.id : ''}),
						html.span('#arrow', '→'),
						html.input({id: 'to', class: 'station', name: 'to', type: 'text', value: (params.to) ? params.to.name : '', placeholder: 'Zielbahnhof'}),
						html.input({id: 'to-id', name: 'toID', type: 'hidden', value: (params.to) ? params.to.id : ''}),
						html.input({id: 'submit', name: 'submit', type: 'submit', value: '↳'})
					]),
					html.div('#options', [
						html.span('.optRow', [
							html.select({name: 'class', id: 'class'}, [
								option(1, '1.', params.class==1),
								option(2, '2.', params.class!==1),
							]),
							' Klasse, Bahncard: ',
							html.select({name: 'bc', id: 'bc'}, [
								option(0, '--', params.bc==0),
								option(2, '25', (params.bc==1 || params.bc==2)),
								option(4, '50', (params.bc==3 || params.bc==4))
							]),
							', '
						]),
						html.span('.optRow', [
							html.label('#start', ['ab: ', html.input({type: 'text', placeholder: '--:--', value: (params.start) ? params.start.format('hh:mm') : (params.set)? '' : '06:00', name: 'start'}), ' Uhr']),
							', '
						]),
						html.span('.optRow', [
							html.label('#end', ['bis: ', html.input({type: 'text', placeholder: '--:--', value: (params.end)? params.end.format('hh:mm') : '', name: 'end'}), ' Uhr']),
							', '
						]),
						html.span('.optRow', [
							'bis zu ',
							html.label('#duration', [html.input({type: 'text', placeholder: 24, value: params.duration || '', name: 'duration'}), ' h Fahrzeit']),
							'.'
						])
					]),
				])
			]),
			html.span('#footer', [html.a({href: '/impressum'}, 'Impressum & Rechtliches')]),
			html.script({src: 'assets/jquery.js'}),
			html.script({src: 'assets/jquery.autocomplete.js'}),
			html.script({src: 'assets/main.js'})
		])
	])
	return beautify(document)
}

module.exports = generate