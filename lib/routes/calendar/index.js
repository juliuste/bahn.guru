import createParseParams from '../params.js'
import createTemplate from './template.js'
import calendar from './calendar.js'

const createForwardError = (req, next) => (code) => {
	req.query.error = code
	next()
}

const createCalendarRoute = (api) => {
	const parseParams = createParseParams(api)
	const template = createTemplate(api)
	return async (req, res, next) => {
		const forwardError = createForwardError(req, next)
		try {
			// general and api-specific params
			const { params, error } = await parseParams(req.query)
			if (error) return forwardError(error)

			// route-specific params
			if (+req.query.weeks && +req.query.weeks <= 12 && +req.query.weeks > 0) params.weeks = +req.query.weeks
			else params.weeks = 4

			// route content
			const calendarResults = await calendar(api, params)
			if (!calendarResults) return forwardError('no-results')
			return res.send(template({ input: params, output: calendarResults }))
		} catch (error) {
			console.error(error)
			return forwardError('unknown')
		}
	}
}

export default createCalendarRoute
