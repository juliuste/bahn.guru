'use strict'

const stations = require('flix').regions

const station = (s) => {
	if(!s) return Promise.reject(false)
	return stations().then(
		(data) => {
			const found = data.find(x => x.name===s)
			if(found) return found
			return false
		},
		(error) => false
	)
}

module.exports = station
