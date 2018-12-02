'use strict'

const createParseParams = require('./params')
const createTemplate = require('./template')
const calendar = require('./calendar')

const forward = (req, next) => (code) => {
	req.query.error = code
	next()
}

const createCalendarRoute = (api) => (req, res, next) => {
	const parseParams = createParseParams(api)
	const template = createTemplate(api)
	const error = forward(req, next)
	parseParams(req.query)
		.then(params => {
			if (!params) error('1')
			if (params.status === 'error') error(params.msg ? 'noStations' : '1')
			else {
				return calendar(api, params.data)
					.then(data => {
						if (data) return res.send(template({ input: params.data, output: data }, null))
						error('noResults')
					})
					// eslint-disable-next-line handle-callback-err
					.catch(err => error('1'))
			}
		})
		// eslint-disable-next-line handle-callback-err
		.catch(err => error('1'))
}

module.exports = createCalendarRoute
