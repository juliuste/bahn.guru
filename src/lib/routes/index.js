import createGreetingRoute from './greeting/index.js'
import createStartRoute from './start/index.js'
import createDayRoute from './day/index.js'
import createCalendarRoute from './calendar/index.js'
import createImpressumRoute from './impressum/index.js'
import createFaqRoute from './faq/index.js'

const createRoutes = api => {
	const greetingRoute = createGreetingRoute(api)
	const startRoute = createStartRoute(api)
	const dayRoute = createDayRoute(api)
	const calendarRoute = createCalendarRoute(api)
	const impressumRoute = createImpressumRoute(api)
	const faqRoute = createFaqRoute(api)
	return { greetingRoute, startRoute, dayRoute, calendarRoute, impressumRoute, faqRoute }
}

export default createRoutes
