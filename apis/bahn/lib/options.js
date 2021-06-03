'use strict'

const html = require('pithy')
// eslint-disable-next-line no-unused-vars
const moment = require('moment-timezone')
// eslint-disable-next-line no-unused-vars
const mdf = require('moment-duration-format')
const isNull = require('lodash/isNull')

const optionHTML = (value, text, checked) => {
	const opt = { value: value }
	if (checked) opt.selected = true
	return html.option(opt, text)
}

const input = (params) => ([
	html.span('.optRow', [
		html.select({ name: 'class', id: 'class' }, [
			optionHTML(1, '1.', params.class === 1),
			optionHTML(2, '2.', params.class !== 1),
		]),
		' Klasse, Bahncard: ',
		html.select({ name: 'bc', id: 'bc' }, [
			optionHTML(0, '--', params.bc === 0),
			optionHTML(2, '25', (params.bc === 1 || params.bc === 2)),
			optionHTML(4, '50', (params.bc === 3 || params.bc === 4)),
		]),
		', ',
	]),
	html.span('.optRow', [
		html.label('#departureAfter', ['ab: ', html.input({ type: 'text', placeholder: '--:--', value: (params.departureAfter) ? params.departureAfter.format('hh:mm') : '', name: 'departureAfter' }), ' Uhr']),
		', ',
	]),
	html.span('.optRow', [
		html.label('#arrivalBefore', ['bis: ', html.input({ type: 'text', placeholder: '--:--', value: (params.arrivalBefore) ? params.arrivalBefore.format('hh:mm') : '', name: 'arrivalBefore' }), ' Uhr']),
		', ',
	]),
	html.span('.optRow', [
		'max. ',
		html.label('#duration', [html.input({ type: 'text', placeholder: 24, value: params.duration || '', name: 'duration' }), ' h Fahrzeit']),
		', ',
	]),
	html.span('.optRow', [
		'max. ',
		html.label('#maxChanges', [html.input({ type: 'text', placeholder: '∞', value: Number.isInteger(params.maxChanges) && params.maxChanges >= 0 ? params.maxChanges : '', name: 'maxChanges' }), ' Umstiege']),
		'.',
	]),
])

const text = (params) => {
	const result = []
	if (params.class && params.class === 1) result.push(params.class + '. Klasse', ', ')
	if (params.bc && (params.bc === 1 || params.bc === 2)) result.push('mit BahnCard 25', ', ')
	if (params.bc && (params.bc === 3 || params.bc === 4)) result.push('mit BahnCard 50', ', ')
	if (params.departureAfter && +params.departureAfter > 0) result.push('ab ' + params.departureAfter.format('HH:mm') + ' Uhr', ', ')
	if (params.arrivalBefore && +params.arrivalBefore > 0) result.push('bis ' + params.arrivalBefore.format('HH:mm') + ' Uhr', ', ')
	if (params.duration && params.duration > 0) result.push('Fahrzeit bis ' + params.duration + ' Stunden', ', ')
	if (!isNull(params.maxChanges)) {
		if (params.maxChanges === 0) result.push('keine Umstiege', ', ')
		else if (params.maxChanges === 1) result.push('max. ' + params.maxChanges + ' Umstieg', ', ')
		else result.push('max. ' + params.maxChanges + ' Umstiege', ', ')
	}
	if (result.length) result.pop()
	return result
}

const url = (params) => {
	const result = []
	if (params.class) result.push('class=' + params.class)
	if (params.bc) result.push('bc=' + params.bcOriginal)
	if (params.departureAfter) result.push('departureAfter=' + params.departureAfter.format('HH:mm'))
	if (params.arrivalBefore) result.push('arrivalBefore=' + params.arrivalBefore.format('HH:mm'))
	if (params.duration) result.push('duration=' + params.duration)
	if (!isNull(params.maxChanges)) result.push('maxChanges=' + params.maxChanges)
	return result
}

module.exports = { input, text, url }
