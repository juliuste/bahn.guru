'use strict'

const locations = require('search-meinfernbus-locations')
const filter = require('lodash.filter')

const station = (s) => {
	if(!s) return Promise.reject(false)
	const result = filter(locations(s), {type: 'city'})
	if(result.length) return Promise.resolve({id: result[0].id, name: result[0].name})
	return false
}

module.exports = station