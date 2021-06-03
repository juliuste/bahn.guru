import client from 'db-prices'
import moment from 'moment-timezone'
import settings from '../settings.js'
import isNull from 'lodash/isNull.js'

const journeys = (params, day) => {
	const dayTimestamp = +(moment.tz(day, settings.timezone).startOf('day'))
	return client(params.origin.id, params.destination.id, moment(day).toDate(), {
		class: params.class,
		travellers: [{ typ: 'E', bc: params.bc }],
	})
		.then(results =>
			results.filter(j => {
				const departure = new Date(j.legs[0].departure)
				const arrival = new Date(j.legs[j.legs.length - 1].arrival)
				const duration = +arrival - (+departure)
				const changes = j.legs.length - 1
				return (
					(!params.duration || duration <= params.duration * 60 * 60 * 1000) &&
					(!params.departureAfter || +departure >= +params.departureAfter + dayTimestamp) &&
					(!params.arrivalBefore || +arrival <= +params.arrivalBefore + dayTimestamp) &&
					(isNull(params.maxChanges) || params.maxChanges >= changes) &&
					(j.legs.some(l => l.line && l.line.product !== 'BUS'))
				)
			}),
		)
		.then(results => {
			for (const journey of results) {
				for (const leg of journey.legs) {
					leg.product = leg.line ? leg.line.product : null
				}
			}
			return results
		})
		.catch((err) => {
			console.error(err)
			return []
		})
}

export default journeys
