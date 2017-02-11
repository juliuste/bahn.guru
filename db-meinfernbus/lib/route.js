'use strict'

const sortby = require('lodash.sortby')
const db = require('./routes/db')
const meinfernbus = require('./routes/meinfernbus')

const route = (params, day) => 
	Promise.all([db(params, day), meinfernbus(params, day)])
	.then((res) => res[0].concat(res[1])) // concat results
	.then((res) => sortby(res, ['price', 'duration']))

module.exports = route