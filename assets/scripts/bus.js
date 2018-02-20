'use strict'

const api = {
	url: 'https://1.mfb.juliustens.eu/regions',
	adapter: (res) => res.map((e) => e.name)
}
const autocomplete = require('horsey')
const fetch = require('fetch-ponyfill')().fetch
const querystring = require('querystring').stringify

autocomplete(document.querySelector('#originInput'), {
	suggestions: (value, done) => {
		fetch(api.url+'?'+querystring({query: value}), {
			method: "get",
			mode: "cors"
		}).then((r) => r.json()).then(api.adapter).then((res) => done(res))
	},
	limit: 5,
	appendTo: document.querySelector('#origin'),
	autoHideOnClick: true,
	autoHideOnBlur: true
})

autocomplete(document.querySelector('#destinationInput'), {
	suggestions: (value, done) => {
		fetch(api.url+'?'+querystring({query: value}), {
			method: "get",
			mode: "cors"
		}).then((r) => r.json()).then(api.adapter).then((res) => done(res))
	},
	limit: 5,
	appendTo: document.querySelector('#destination'),
	autoHideOnClick: true,
	autoHideOnBlur: true
})

document.querySelector('#originInput').addEventListener('horsey-selected', () => document.querySelector('#destinationInput').focus())
document.querySelector('#destinationInput').addEventListener('horsey-selected', () => document.querySelector('#submit').focus())
