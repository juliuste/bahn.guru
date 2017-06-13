'use strict'

const html = require('pithy')
const moment = require('moment-timezone')
const mdf = require('moment-duration-format')

const optionHTML = (value, text, checked) => {
	const opt = {value: value}
	if(checked) opt.selected = true
	return html.option(opt, text)
}

const input = (params) => ([
	html.span('.optRow', [
		html.select({name: 'class', id: 'class'}, [
			optionHTML(1, '1.', params.class==1),
			optionHTML(2, '2.', params.class!==1),
		]),
		' Klasse, Bahncard: ',
		html.select({name: 'bc', id: 'bc'}, [
			optionHTML(0, '--', params.bc==0),
			optionHTML(2, '25', (params.bc==1 || params.bc==2)),
			optionHTML(4, '50', (params.bc==3 || params.bc==4))
		]),
		', '
	]),
	html.span('.optRow', [
		html.label('#start', ['ab: ', html.input({type: 'text', placeholder: '--:--', value: (params.start) ? params.start.format('hh:mm') : '', name: 'start'}), ' Uhr']),
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
])

const text = (params) => {
	const result = []
	if(params.class&&params.class==1) result.push(params.class+'. Klasse', ', ')
	if(params.bc&&(params.bc==1||params.bc==2)) result.push('mit BahnCard 25', ', ')
	if(params.bc&&(params.bc==3||params.bc==4)) result.push('mit BahnCard 50', ', ')
	if(params.start&&params.start.format('m')>0) result.push('ab '+params.start.format('HH:mm')+' Uhr', ', ')
	if(params.end&&params.end.format('m')>0) result.push('bis '+params.end.format('HH:mm')+' Uhr', ', ')
	if(params.duration&&params.duration>0) result.push('Fahrzeit bis '+params.duration+' Stunden', ', ')
	if(result.length) result.pop()
	return result
}

const url = (params) => {
	const result = []
	if(params.class) result.push('class='+params.class)
	if(params.bc) result.push('bc='+params.bc_original)
	if(params.start) result.push('start='+params.start.format('HH:mm'))
	if(params.end) result.push('end='+params.end.format('HH:mm'))
	if(params.duration) result.push('duration='+params.duration)
	return result
}

module.exports = {input, text, url}
