'use strict'

const createGreetingRoute = require('./greeting')
const createStartRoute = require('./start')
const createDayRoute = require('./day')
const createCalendarRoute = require('./calendar')
const createImpressumRoute = require('./impressum')
const createFaqRoute = require('./faq')

const createRoutes = api => {
	const greetingRoute = createGreetingRoute(api)
	const startRoute = createStartRoute(api)
	const dayRoute = createDayRoute(api)
	const calendarRoute = createCalendarRoute(api)
	const impressumRoute = createImpressumRoute(api)
	const faqRoute = createFaqRoute(api)
	return { greetingRoute, startRoute, dayRoute, calendarRoute, impressumRoute, faqRoute }
}

module.exports = createRoutes
