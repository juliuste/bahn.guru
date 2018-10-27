'use strict'

const stations = require('db-hafas')('bahn.guru').locations

const station = (s) => {
	if(!s) return Promise.reject(false)
	return stations(s).then(
		(data) => {
			if(data.length>0) return data[0]
			return false
		},
		(error) => false
	)
}

module.exports = station
