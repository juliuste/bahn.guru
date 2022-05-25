import { h } from 'hastscript'
// eslint-disable-next-line no-unused-vars
import moment from 'moment-timezone'
// eslint-disable-next-line no-unused-vars
import mdf from 'moment-duration-format'
import isNull from 'lodash/isNull.js'

// eslint-disable-next-line no-unused-vars
const optionHTML = (value, text, checked) => {
	const opt = { value }
	if (checked) opt.selected = true
	return h('option', opt, text)
}

export const input = (params) => ([
	h('span.optRow', [
		h('label#departureAfter', ['Ab: ', h('input', { type: 'text', placeholder: '--:--', value: (params.departureAfter) ? params.departureAfter.format('hh:mm') : '', name: 'departureAfter' }), ' Uhr']),
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
	if (params.departureAfter && params.departureAfter.format('m') > 0) result.push('ab ' + params.departureAfter.format('HH:mm') + ' Uhr', ', ')
	if (params.arrivalBefore && params.arrivalBefore.format('m') > 0) result.push('bis ' + params.arrivalBefore.format('HH:mm') + ' Uhr', ', ')
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
	if (params.departureAfter) result.push('departureAfter=' + params.departureAfter.format('HH:mm'))
	if (params.arrivalBefore) result.push('arrivalBefore=' + params.arrivalBefore.format('HH:mm'))
	if (params.duration) result.push('duration=' + params.duration)
	if (!isNull(params.maxChanges)) result.push('maxChanges=' + params.maxChanges)
	return result
}
