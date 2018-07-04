'use strict'

const addAutocomplete = require('./common')

const api = {
	url: 'https://1.db.transport.rest/stations',
	adapter: res => res.map(e => e.name)
}

addAutocomplete(api)
