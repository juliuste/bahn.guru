import moment from 'moment-timezone'
// eslint-disable-next-line no-unused-vars
import mdf from 'moment-duration-format'
import isNaN from 'lodash/isNaN.js'

const parseTime = (time) => {
	if (!time) return null
	time = time.split(':')
	if (time.length === 1) {
		const hours = +time[0]
		if (!isNaN(hours) && hours >= 0 && hours < 24) return moment.duration(hours, 'hours')
	}
	if (time.length === 2) {
		const hours = +time[0]
		const minutes = +time[1]
		if (!isNaN(hours) && !isNaN(minutes) && hours >= 0 && hours < 24 && minutes >= 0 && minutes < 60) return moment.duration(60 * hours + minutes, 'minutes')
	}
	return null
}

const parseParams = (params) => {
	// defaults
	const settings = {
		duration: null,
		departureAfter: null,
		arrivalBefore: null,
		maxChanges: null,
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

export default parseParams
