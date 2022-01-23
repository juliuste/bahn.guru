import { h } from 'hastscript'
// eslint-disable-next-line no-unused-vars
import moment from 'moment-timezone'
// eslint-disable-next-line no-unused-vars
import mdf from 'moment-duration-format'
import isNull from 'lodash/isNull.js'

const optionHTML = (value, text, checked) => {
	const opt = { value: value }
	if (checked) opt.selected = true
	return h('option', opt, text)
}

export const input = (params) => ([
	h('span.optRow', [
		h('select', { name: 'class', id: 'class' }, [
			optionHTML(1, '1.', params.class === 1),
			optionHTML(2, '2.', params.class !== 1),
		]),
		' Klasse, Bahncard: ',
		h('select', { name: 'bc', id: 'bc' }, [
			optionHTML(0, '--', params.bc === 0),
			optionHTML(2, '25', (params.bc === 1 || params.bc === 2)),
			optionHTML(4, '50', (params.bc === 3 || params.bc === 4)),
		]),
		', ',
		' Alter: ',
		h('select', { name: 'alter', id: 'alter' }, [
			optionHTML(27, 'ab 27 Jahre', params.alter === 27),
			optionHTML(26, '15 – 26 Jahre', params.alter === 26),
		]),
		', ',
	]),
	h('span.optRow', [
		h('label#departureAfter', ['ab: ', h('input', { type: 'text', placeholder: '--:--', value: (params.departureAfter) ? params.departureAfter.format('hh:mm') : '', name: 'departureAfter' }), ' Uhr']),
		', ',
	]),
	h('span.optRow', [
		h('label#arrivalBefore', ['bis: ', h('input', { type: 'text', placeholder: '--:--', value: (params.arrivalBefore) ? params.arrivalBefore.format('hh:mm') : '', name: 'arrivalBefore' }), ' Uhr']),
		', ',
	]),
	h('span.optRow', [
		'max. ',
		h('label#duration', [h('input', { type: 'text', placeholder: 24, value: params.duration || '', name: 'duration' }), ' h Fahrzeit']),
		', ',
	]),
	h('span.optRow', [
		'max. ',
		h('label#maxChanges', [h('input', { type: 'text', placeholder: '∞', value: Number.isInteger(params.maxChanges) && params.maxChanges >= 0 ? params.maxChanges : '', name: 'maxChanges' }), ' Umstiege']),
		'.',
	]),
])

export const text = (params) => {
	const result = []
	if (params.class && params.class === 1) result.push(params.class + '. Klasse', ', ')
	if (params.bc && (params.bc === 1 || params.bc === 2)) result.push('mit BahnCard 25', ', ')
	if (params.bc && (params.bc === 3 || params.bc === 4)) result.push('mit BahnCard 50', ', ')
	if (params.alter && params.alter === 26) result.push('15 – 26 Jahre', ', ')
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

export const url = (params) => {
	const result = []
	if (params.class) result.push('class=' + params.class)
	if (params.bc) result.push('bc=' + params.bcOriginal)
	if (params.alter) result.push('alter=' + params.alter)
	if (params.departureAfter) result.push('departureAfter=' + params.departureAfter.format('HH:mm'))
	if (params.arrivalBefore) result.push('arrivalBefore=' + params.arrivalBefore.format('HH:mm'))
	if (params.duration) result.push('duration=' + params.duration)
	if (!isNull(params.maxChanges)) result.push('maxChanges=' + params.maxChanges)
	return result
}
