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
		html.label('#departureAfter', ['Ab: ', html.input({type: 'text', placeholder: '--:--', value: (params.departureAfter) ? params.departureAfter.format('hh:mm') : '', name: 'departureAfter'}), ' Uhr']),
		', '
	]),
	html.span('.optRow', [
		html.label('#arrivalBefore', ['bis: ', html.input({type: 'text', placeholder: '--:--', value: (params.arrivalBefore)? params.arrivalBefore.format('hh:mm') : '', name: 'arrivalBefore'}), ' Uhr']),
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
	if(params.departureAfter&&params.departureAfter.format('m')>0) result.push('ab '+params.departureAfter.format('HH:mm')+' Uhr', ', ')
	if(params.arrivalBefore&&params.arrivalBefore.format('m')>0) result.push('bis '+params.arrivalBefore.format('HH:mm')+' Uhr', ', ')
	if(params.duration&&params.duration>0) result.push('Fahrzeit bis '+params.duration+' Stunden', ', ')
	if(result.length) result.pop()
	return result
}

const url = (params) => {
	const result = []
	if(params.departureAfter) result.push('departureAfter='+params.departureAfter.format('HH:mm'))
	if(params.arrivalBefore) result.push('arrivalBefore='+params.arrivalBefore.format('HH:mm'))
	if(params.duration) result.push('duration='+params.duration)
	return result
}

module.exports = {input, text, url}
