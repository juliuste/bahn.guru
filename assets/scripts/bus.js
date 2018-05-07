'use strict'

const addAutocomplete = require('./common')

const api = {
	url: 'https://1.mfb.juliustens.eu/regions',
	adapter: res => res.map(e => e.name)
}

addAutocomplete(api)
