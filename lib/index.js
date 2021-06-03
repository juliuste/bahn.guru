import createExpress from 'express'
import * as http from 'http'
import compression from 'compression'
import apiCache from 'apicache'

import createRoutes from './routes/index.js'

const createServer = (api) => {
	// setup HTTP and HTTPS servers
	const express = createExpress()
	const server = http.createServer(express)

	// enable caching
	express.use(apiCache.middleware('15 minutes'))

	// enable gzip compression
	express.use(compression())

	// enable static assets directory
	express.use('/assets', createExpress.static('assets'))

	// setup and enable routes
	const { greetingRoute, startRoute, dayRoute, calendarRoute, impressumRoute, faqRoute } = createRoutes(api)
	express.get('/', greetingRoute, startRoute)
	express.get('/start', startRoute)
	express.get('/day', dayRoute, startRoute)
	express.get('/calendar', calendarRoute, startRoute)
	express.get('/impressum', impressumRoute)
	express.get('/faq', faqRoute)

	return server
}

export default createServer
