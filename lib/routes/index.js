'use strict'

const createMainRoute = require('./main')
const createDayRoute = require('./day')
const createCalendarRoute = require('./calendar')
const createImpressumRoute = require('./impressum')
const createFaqRoute = require('./faq')

const createRoutes = api => {
	const mainRoute = createMainRoute(api)
	const dayRoute = createDayRoute(api)
	const calendarRoute = createCalendarRoute(api)
	const impressumRoute = createImpressumRoute(api)
	const faqRoute = createFaqRoute(api)
	return { mainRoute, dayRoute, calendarRoute, impressumRoute, faqRoute }
}

module.exports = createRoutes
