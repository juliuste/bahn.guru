'use strict'

const config = require('config')
const fs = require('fs')
const express = require('express')
const corser = require('corser')
const http = require('http')
const compression = require('compression')
const nocache = require('nocache')
const path = require('path')
const morgan = require('morgan')
const shorthash = require('shorthash').unique
const p = require('path')

const main = require('./lib/main/')
const day = require('./lib/day/')
const calendar = require('./lib/calendar/')
const impressum = require('./lib/impressum/')
const faq = require('./lib/faq/')

// setup HTTP and HTTPS servers
const api = express()
const server = http.createServer(api)

// enable gzip compression
api.use(compression())

// create a write stream (in append mode)
const accessLogStream = fs.createWriteStream(p.join(__dirname, 'access.log'), {flags: 'a'})

// setup the logger
morgan.token('id', (req, res) => req.headers['x-identifier'] || shorthash(req.ip))
api.use(morgan(':date[iso] :id :method :url :status :response-time ms', {stream: accessLogStream}))

// enable static assets directory
api.use('/assets', express.static('assets'));

// set routes
api.get('/', main)
api.get('/day', day, main)
api.get('/calendar', calendar, main)
api.get('/impressum', impressum)
api.get('/faq', faq)

// start HTTP server
server.listen(config.port, (e) => {
	if (e) return console.error(e)
	console.log(`HTTP: Listening on ${config.port}.`)
})
