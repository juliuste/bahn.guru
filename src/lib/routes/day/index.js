import moment from 'moment-timezone'
import createParseParams from '../params.js'
import createTemplate from './template.js'
import day from './day.js'

const createForwardError = (req, next) => (code) => {
	req.query.error = code
	next()
}

const parseDate = (date, timezone) => {
	if (!date) return moment().tz(timezone).startOf('day')
	return moment(date, 'DD.MM.YYYY').tz(timezone).startOf('day')
}

const createDayRoute = (api) => {
	const parseParams = createParseParams(api)
	const template = createTemplate(api)
	return async (req, res, next) => {
		const forwardError = createForwardError(req, next)
		try {
			// general and api-specific params
			const { params, error } = await parseParams(req.query)
			if (error) return forwardError(error)

			// route-specific params
			params.date = parseDate(req.query.date, api.settings.timezone)

			// route content
			const dayResults = await day(api, params)
			if (!dayResults || dayResults.length === 0) return forwardError('no-results')
			return res.send(template({ input: params, output: dayResults }))
		} catch (error) {
			console.error(error)
			return forwardError('unknown')
		}
	}
}

export default createDayRoute
