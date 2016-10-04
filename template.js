'use strict'

const html = require('pithy')
const beautify = require('js-beautify').html

const head = (data) => {
	const elements = [
		html.meta({charset: 'utf-8'}),
		html.meta({name: 'viewport', content: "width=device-width, initial-scale=1.0, user-scalable=no"}),
		html.title(null, 'DB Preiskalender'),
		html.link({rel: 'stylesheet', type: 'text/css', href: 'assets/main.css'}),
		html.link({rel: 'stylesheet', type: 'text/css', href: 'assets/autocomplete.css'})
	]
	if(data) elements.push(html.link({rel: 'stylesheet', type: 'text/css', href: 'assets/cal.css'}))
	return html.head(null, elements)
}

const calendar = (data) => {
	if(!data) return html.span()
	const cal = data.output
	let weeks = []
	for(let week of cal){
		let days = []
		for(let day of week){
			days.push(html.td({class: (day.past)? 'empty' : ((day.cheapest)? 'cheapest' : '')}, [
				html.span('.date', day.date.formatted),
				html.span('.price', (!day.past) ? ((day.price) ? [day.price.euros, html.sup(null, day.price.cents), html.br(null)] : ['–', html.br(null)]) : ''),
				html.span('.duration', (!day.past && day.duration) ? ('🕒 '+day.duration) : '')
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

const option = (value, text, checked) => {
	const opt = {value: value}
	if(checked) opt.selected = true
	return html.option(opt, text)
}

const moreLink = (data) => {
	if(!data) return null
	const i = data.input
	const bc = i.bc + (i.bc%2)
	const weeks = (i.weeks+2<=12)? i.weeks+2 : 12
	const start = (i.start)? i.start.format('hh:mm') : null
	const end = (i.end)? i.end.format('hh:mm') : null
	return [html.a({id: 'later', href: `./?fromID=${i.from.id}&toID=${i.to.id}&class=${i.class}&bc=${bc}&weeks=${weeks}&duration=${i.duration}&price=${i.price}&start=${start}&end=${end}&submit=Y#later`}, 'weitere Termine anzeigen...')]
}

const generate = (data, error) => {
	let document = '<!doctype html>' + html.html(null, [
		head(data),
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
					html.div('#options', [
						html.div('#class', [html.span(null, ['Klasse:',
							html.label(null, [radio('class', 1, (data && data.input.class==1)), ' 1']),
							html.label(null, [radio('class', 2, (!data || (data && data.input.class==2))), ' 2'])
						])]),
						html.div('#bc', [html.span(null, ['Bahncard: ', html.select({name: 'bc'}, [
							option(0, '-', (!data || (data && data.input.bc==0))),
							option(2, '25', (data && (data.input.bc==1 || data.input.bc==2))),
							option(4, '50', (data && (data.input.bc==3 || data.input.bc==4)))
						])])]),
						html.div('.filter', [
							html.span('#duration', [html.label(null, ['max. Dauer:', html.input({type: 'number', min: 1, max: 24, value: (data && data.input.duration) ? +data.input.duration : null, name: 'duration'}), 'h'])])
						]),
						html.div('.filter', [
							html.span('#start', [html.label(null, ['Abfahrt ab: ', html.input({type: 'time', min: '00:00', max: '23:59', value: (data && data.input.start)? data.input.start.format('hh:mm') : (data && data.input.start===null)? '' : '06:00', name: 'start'}), ' Uhr'])]),
							html.br(),
							html.span('#end', [html.label(null, ['Ankunft bis: ', html.input({type: 'time', min: '00:00', max: '23:59', value: (data && data.input.end)? data.input.end.format('hh:mm') : '', name: 'end'}), ' Uhr'])])
						])
					]),
				]),
				calendar(data),
				html.span(null, moreLink(data))
			]),
			html.span('#impressum', [html.a({href: '/impressum'}, 'Impressum & Rechtliches')]),
			html.script({src: 'assets/jquery.js'}),
			html.script({src: 'assets/jquery.autocomplete.js'}),
			html.script({src: 'assets/main.js'})
		])
	])
	return beautify(document)
}

module.exports = generate