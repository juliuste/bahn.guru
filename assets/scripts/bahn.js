'use strict'

const addAutocomplete = require('./common')

const api = {
	url: '/api/locations',
	query: {
		results: 5,
		stations: true,
		poi: false,
		addresses: false,
	},
	adapter: res => res.map(e => e.name),
}

addAutocomplete(api)
