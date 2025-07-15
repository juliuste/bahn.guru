import createExpress from 'express'
import * as http from 'http'
import compression from 'compression'
import apiCache from 'apicache'

import createRoutes from './routes/index.js'
import * as api from '../api/index.js'
import helmet from 'helmet'
import { stationsAll } from '../api/lib/station.js'

const createServer = () => {
	// setup HTTP and HTTPS servers
	const express = createExpress()
	const server = http.createServer(express)

	// enable security best-practicesin production environments
	express.use(helmet({
		contentSecurityPolicy: false,
		hsts: (process.env.NODE_ENV === 'production')
			? {
				maxAge: 31536000, // 1 year
				includeSubDomains: true,
				preload: true,
			}
			: false,
	}))

	// enable caching
	express.use(apiCache.middleware('15 minutes'))

	// enable gzip compression
	express.use(compression())

	// enable static assets directory
	express.use('/assets', createExpress.static('assets'))

	// API endpoint for station autocomplete
	express.get('/api/locations', async (req, res) => {
		const query = req.query.query || ''
		if (!query) return res.json([])
		try {
			const results = await stationsAll(query)
			res.json(results)
		} catch (e) {
			res.status(500).json([])
		}
	})

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
