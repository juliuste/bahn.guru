'use strict'

const stations = require('db-hafas').locations

const station = (s) => {
	if(!s) return Promise.reject(false)
	return stations(s).then(
		(data) => {
			if(data.length>0) return {id: data[0].id, name: data[0].name}
			return false
		},
		(error) => false
	)
}

module.exports = station