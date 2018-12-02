'use strict'

const stations = require('flix').regions

const station = (s) => {
	// eslint-disable-next-line prefer-promise-reject-errors
	if (!s) return Promise.reject(false)
	return stations()
		.then(
			(data) => {
				const found = data.find(x => x.name === s)
				if (found) return found
				return false
			})
		.catch(
			// eslint-disable-next-line handle-callback-err
			(error) => false
		)
}

module.exports = station
