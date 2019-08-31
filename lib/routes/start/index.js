'use strict'

const createParseParams = require('../params')
const createTemplate = require('./template')

const errors = {
	'no-results': { code: 400, message: 'Leider wurden für Ihre Anfrage keine Verbindungen gefunden.' },
	'invalid-stations': { code: 400, message: 'Bitte geben Sie einen gültigen Start- und Zielbahnhof an.' },
	'unknown': { code: 500, message: 'Unbekannter Fehler. Bitte versuchen Sie es erneut oder kontaktieren Sie uns.' }
}

const createStartRoute = (api) => {
	const parseParams = createParseParams(api)
	const template = createTemplate(api)
	return async (req, res, next) => {
		try {
			// general and api-specific params
			const { params, error: paramError } = await parseParams(req.query, { stationsOptional: true })
			// include errors forwarded from other routes
			const errorId = req.query.error || paramError
			if (errorId) {
				const error = errors[errorId] || errors.unknown
				return res.status(error.code).send(template({ params, error }))
			}
			return res.send(template({ params }))
		} catch (catchedError) {
			const error = errors.unknown
			return res.status(error.code).send(template({ error }))
		}
	}
}

module.exports = createStartRoute
