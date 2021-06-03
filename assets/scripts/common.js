'use strict'

const autocomplete = require('horsey')
const fetch = require('fetch-ponyfill')().fetch
const querystring = require('querystring').stringify

const addAutocomplete = (api) => {
	autocomplete(document.querySelector('#originInput'), {
		source: (data, done) => {
			fetch(api.url + '?' + querystring(Object.assign(api.query || {}, { query: data.input })), { method: 'get', mode: 'cors' })
				.then(r => r.json())
				.then(api.adapter)
				.then(data => done(null, [{ list: data }]))
		},
		predictNextSearch: (info) => {
			document.querySelector('#destinationInput').focus()
		},
		limit: 5,
		appendTo: document.querySelector('#origin'),
		autoHideOnClick: true,
		autoHideOnBlur: true,
	})

	autocomplete(document.querySelector('#destinationInput'), {
		source: (data, done) => {
			fetch(api.url + '?' + querystring({ query: data.input }), { method: 'get', mode: 'cors' })
				.then(r => r.json())
				.then(api.adapter)
				.then(data => done(null, [{ list: data }]))
		},
		predictNextSearch: (info) => {
			document.querySelector('#submit').focus()
		},
		limit: 5,
		appendTo: document.querySelector('#destination'),
		autoHideOnClick: true,
		autoHideOnBlur: true,
	})
}

module.exports = addAutocomplete
