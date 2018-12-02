'use strict'

const moment = require('moment-timezone')
// eslint-disable-next-line no-unused-vars
const mdf = require('moment-duration-format')
const isNaN = require('lodash/isNaN')

const parseTime = (time) => {
	if (!time) return null
	time = time.split(':')
	if (time.length === 1) {
		let hours = +time[0]
		if (!isNaN(hours) && hours >= 0 && hours < 24) return moment.duration(hours, 'hours')
	}
	if (time.length === 2) {
		let hours = +time[0]
		let minutes = +time[1]
		if (!isNaN(hours) && !isNaN(minutes) && hours >= 0 && hours < 24 && minutes >= 0 && minutes < 60) return moment.duration(60 * hours + minutes, 'minutes')
	}
	return null
}

const parseParams = (params) => {
	// defaults
	const settings = {
		class: 2,
		bc: 0,
		bcOriginal: 0,
		duration: null,
		departureAfter: null,
		arrivalBefore: null,
		maxChanges: null
	}
	// class
	if (+params.class === 1 || +params.class === 2) settings.class = +params.class
	// BahnCard
	if ([0, 2, 4].indexOf(+params.bc) !== -1) {
		settings.bc = +params.bc + (settings.class - 2)
		settings.bcOriginal = +params.bc
	}
	// duration
	if (+params.duration && +params.duration > 0 && +params.duration < 24) settings.duration = +params.duration
	// departureAfter & arrivalBefore
	settings.departureAfter = parseTime(params.departureAfter)
	settings.arrivalBefore = parseTime(params.arrivalBefore)
	if ((settings.departureAfter && settings.arrivalBefore) && +settings.arrivalBefore.format('m') < +settings.departureAfter.format('m')) settings.arrivalBefore = null

	// maxChanges
	const maxChanges = +params.maxChanges
	if (params.maxChanges !== '' && Number.isInteger(maxChanges) && maxChanges >= 0) settings.maxChanges = maxChanges

	return settings
}

module.exports = parseParams
