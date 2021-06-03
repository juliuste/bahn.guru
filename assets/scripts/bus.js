'use strict'

const addAutocomplete = require('./common')

const api = {
	url: 'https://1.flixbus.transport.rest/regions',
	adapter: res => res.map(e => e.name),
}

addAutocomplete(api)
