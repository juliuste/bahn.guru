'use strict'

const moment = require('moment-timezone')
const mdf = require('moment-duration-format')

const parseTime = (time) => {
	if(!time) return null
	time = time.split(':')
	if(time.length==1){
		let hours = +time[0]
		if(hours!=NaN && hours>=0 && hours<24) return moment.duration(hours, 'hours')
	}
	if(time.length==2){
		let hours = +time[0]
		let minutes = +time[1]
		if(hours!=NaN && minutes!=NaN && hours>=0 && hours<24 && minutes>=0 && minutes<60) return moment.duration(60*hours+minutes, 'minutes')
	}
	return null
}

const parseParams = (params) => {
	// defaults
	const settings = {
		duration: null,
		departureAfter: null,
		arrivalBefore: null
	}
	// duration
	if(+params.duration && +params.duration>0 && +params.duration<24) settings.duration = +params.duration
	// departureAfter & arrivalBefore
	settings.departureAfter = parseTime(params.departureAfter)
	settings.arrivalBefore = parseTime(params.arrivalBefore)
	if((settings.departureAfter && settings.arrivalBefore) && +settings.arrivalBefore.format('m')<+settings.departureAfter.format('m')) settings.arrivalBefore = null

	return settings
}

module.exports = parseParams
