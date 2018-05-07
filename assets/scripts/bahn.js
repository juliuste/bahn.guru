'use strict'

const addAutocomplete = require('./common')

const api = {
	url: 'https://db-hafas.juliuste.de/locations',
	adapter: res => res.map(e => e.name)
}

addAutocomplete(api)
