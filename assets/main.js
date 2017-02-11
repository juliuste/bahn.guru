'use strict'

const api = {
	url: 'https://db-hafas.juliuste.de/locations',
	adapter: (res) => res.map((e) => e.name)
}
const autocomplete = require('horsey')
const fetch = require('fetch-ponyfill')().fetch
const querystring = require('querystring').stringify

autocomplete(document.querySelector('#from'), {
	suggestions: (value, done) => {
		fetch(api.url+'?'+querystring({query: value}), {
			method: "get",
			mode: "cors"
		}).then((r) => r.json()).then(api.adapter).then((res) => done(res))
	},
	limit: 5,
	appendTo: document.querySelector('#fromContainer'),
	autoHideOnClick: true,
	autoHideOnBlur: true
})

autocomplete(document.querySelector('#to'), {
	suggestions: (value, done) => {
		fetch(api.url+'?'+querystring({query: value}), {
			method: "get",
			mode: "cors"
		}).then((r) => r.json()).then(api.adapter).then((res) => done(res))
	},
	limit: 5,
	appendTo: document.querySelector('#toContainer'),
	autoHideOnClick: true,
	autoHideOnBlur: true
})

document.querySelector('#from').addEventListener('horsey-selected', () => document.querySelector('#to').focus())
document.querySelector('#to').addEventListener('horsey-selected', () => document.querySelector('#submit').focus())