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
		class: 2,
		bc: 0,
		bc_original: 0,
		duration: null,
		start: null,
		end: null
	}
	// class
	if(+params.class==1 || +params.class==2) settings.class = +params.class
	// BahnCard
	if([0,2,4].indexOf(+params.bc)!=-1){
		settings.bc = +params.bc+(settings.class-2)
		settings.bc_original = +params.bc
	}
	// duration
	if(+params.duration && +params.duration>0 && +params.duration<24) settings.duration = +params.duration
	// start & end
	settings.start = parseTime(params.start)
	settings.end = parseTime(params.end)
	if((settings.start && settings.end) && +settings.end.format('m')<+settings.start.format('m')) settings.end = null

	return settings
}

module.exports = parseParams
