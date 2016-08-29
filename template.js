'use strict'

const html = require('pithy')

const calendar = (data) => {
	if(!data) return html.span()
	data = data.output
	let weeks = []
	for(let week of data){
		let days = []
		for(let day of week){
			days.push(html.td(null, [
				html.span('.date', day.date),
				html.span('.price', (!day.empty) ? ((day.price) ? [day.price.euros, html.sup(null, day.price.cents), html.br(null)] : ['–', html.br(null)]) : ''),
				html.span('.duration', (!day.empty) ? ('🕒 '+(day.duration || '–')) : '')
			]))
		}
		weeks.push(html.tr(null, days))
	}
	return html.table('#calendar', [
		html.thead(null, [html.tr(null, [
			html.th(null, 'Montag'),
			html.th(null, 'Dienstag'),
			html.th(null, 'Mittwoch'),
			html.th(null, 'Donnerstag'),
			html.th(null, 'Freitag'),
			html.th(null, 'Samstag'),
			html.th(null, 'Sonntag')
		])]),
		html.tbody(null, weeks),
	])
}

const radio = (name, value, checked) => {
	const opt = {type: 'radio', name: name, value: value}
	if(checked) opt.checked = true
	return html.input(opt)
}

const moreLink = (data) => {
	if(!data) return null
	const i = data.input
	const bc = i.bc + (i.bc%2)
	const weeks = (i.weeks+2<=12)? i.weeks+2 : 12
	return [html.a({id: 'later', href: `./?fromID=${i.from.id}&toID=${i.to.id}&class=${i.class}&bc=${bc}&weeks=${weeks}&submit=Y#later`}, 'weitere Termine anzeigen...')]
}

const generate = (data, error) => {
	let document = '<!doctype html>' + html.html(null, [
		html.head(null, [
			html.meta({charset: 'utf-8'}),
			html.meta({name: 'viewport', content: "width=device-width, initial-scale=1.0, user-scalable=no"}),
			html.title(null, 'DB Preiskalender'),
			html.link({rel: 'stylesheet', type: 'text/css', href: 'assets/reset.css'}),
			html.link({rel: 'stylesheet', type: 'text/css', href: 'assets/main.css'}),
			html.link({rel: 'stylesheet', type: 'text/css', href: 'assets/autocomplete.css'}),
			html.link({rel: 'stylesheet', type: 'text/css', href: (data) ? 'assets/cal.css' : 'assets/noCal.css'})
		]),
		html.body(null, [
			html.div('#page', [
				html.h1('#title', 'Preiskalender'),
				html.p('#error', error),
				html.form({id: 'form', action: '/', method: 'GET'}, [
					html.input({id: 'from', class: 'station', name: 'from', type: 'text', value: (data)?data.input.from.name:'', placeholder: 'Startbahnhof'}),
					html.input({id: 'from-id', name: 'fromID', type: 'hidden', value: (data)?data.input.from.id:''}),
					html.span('#arrow', '→'),
					html.input({id: 'to', class: 'station', name: 'to', type: 'text', value: (data)?data.input.to.name:'', placeholder: 'Zielbahnhof'}),
					html.input({id: 'to-id', name: 'toID', type: 'hidden', value: (data)?data.input.to.id:''}),
					html.input({id: 'submit', name: 'submit', type: 'submit', value: '↳'}),
					html.table('#options', [html.tr(null, [
						html.td('#class', [
							html.label(null, [radio('class', 1, (data && data.input.class==1)), ' 1. Klasse']),
							html.label(null, [radio('class', 2, (!data || (data && data.input.class==2))), ' 2. Klasse'])
						]),
						html.td('#bc', [
							html.label(null, [radio('bc', 0, (!data || (data && data.input.bc==0))), ' keine BahnCard']),
							html.label(null, [radio('bc', 2, (data && (data.input.bc==1 || data.input.bc==2))), ' BC 25']),
							html.label(null, [radio('bc', 4, (data && (data.input.bc==3 || data.input.bc==4))), ' BC 50'])
						])
					])])
				]),
				calendar(data),
				html.span(null, moreLink(data))
			]),
			html.script({src: 'assets/jquery.js'}),
			html.script({src: 'assets/jquery.autocomplete.js'}),
			html.script({src: 'assets/main.js'})
		])
	])
	return document
}

module.exports = generate