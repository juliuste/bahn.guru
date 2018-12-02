'use strict'

const fs = require('fs')
const path = require('path')
const createServer = require('./lib')

const port = process.env.PORT || 3000
const apiId = process.env.API || 'bahn'
const api = require(`./apis/${apiId}`)

const logging = !!process.env.LOGGING
// create a write stream (in append mode) if logging is enabled
let accessLogStream
if (logging) accessLogStream = fs.createWriteStream(path.join(__dirname, `access-${apiId}.log`), { flags: 'a' })

const server = createServer({ api, accessLogStream })

// start HTTP server
server.listen(port, error => {
	if (error) return console.error(error)
	console.log(`HTTP: Listening on ${port}.`)
})
