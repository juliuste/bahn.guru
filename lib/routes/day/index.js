'use strict'

const createParseParams = require('./params')
const createTemplate = require('./template')
const day = require('./day')

const forward = (req, next) => (code) => {
	req.query.error = code
	next()
}

const createDayRoute = (api) => (req, res, next) => {
	const parseParams = createParseParams(api)
	const template = createTemplate(api)
	const error = forward(req, next)
	parseParams(req.query)
		.then(params => {
			if (!params) error('1')
			if (params.status === 'error') error('1')
			else {
				return day(api, params.data)
					.then(data => {
						if (data) return res.send(template({ input: params.data, output: data }))
						return error('noResults')
					})
					.catch(err => {
						console.error(err)
						error('1')
					})
			}
		})
		.catch(err => {
			console.log(err)
			error('1')
		})
}

module.exports = createDayRoute
