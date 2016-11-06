'use strict'

const config       = require('config')
const fs           = require('fs')
const express      = require('express')
const spdy         = require('spdy')
const corser       = require('corser')
const http		   = require('http')
const forceSSL 	   = require('express-force-ssl')
const compression  = require('compression')
const nocache      = require('nocache')
const path         = require('path')

const main = require('./main/index')
const day = require('./day/index')
const calendar = require('./calendar/index')
const impressum = require('./impressum/index')


const ssl = {
	  key:  fs.readFileSync(config.key)
	, cert: fs.readFileSync(config.cert)
	, ca:   fs.readFileSync(config.ca)
}



const api = express()
const httpApi = express()

const httpServer = http.createServer(httpApi)
const server = spdy.createServer(ssl, api)

httpApi.use(forceSSL)
httpApi.set('forceSSLOptions', {
  httpsPort: config.port
})

api.use(compression())

api.use('/assets', express.static('assets'));



api.get('/', main)
api.get('/day', day)
api.get('/calendar', calendar, main)
api.get('/impressum', impressum)

server.listen(config.port, (e) => {
	if (e) return console.error(e)
	console.log(`HTTPS: Listening on ${config.port}.`)
})

httpServer.listen(config.httpPort, (e) => {
	if (e) return console.error(e)
	console.log(`HTTP: Listening on ${config.httpPort}.`)
})