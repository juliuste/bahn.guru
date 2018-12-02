'use strict'

const createParseParams = require('./params')
const createTemplate = require('./template')

const createMainRoute = (api) => (req, res, next) => {
	const parseParams = createParseParams(api)
	const template = createTemplate(api)
	return parseParams(req.query)
		.then(params => {
			if (params.error) return res.status(400).send(template(params))
			return res.send(template(params))
		})
		.catch(error => {
			console.error(error)
			res.send(template())
		})
}

module.exports = createMainRoute
