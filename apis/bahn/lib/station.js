'use strict'

const stations = require('db-hafas')('bahn.guru').locations

const station = (s) => {
	// eslint-disable-next-line prefer-promise-reject-errors
	if (!s) return Promise.reject(false)
	return stations(s)
		.then(
			(data) => {
				if (data.length > 0) return data[0]
				return false
			})
		.catch(
			// eslint-disable-next-line handle-callback-err
			(error) => false
		)
}

module.exports = station
