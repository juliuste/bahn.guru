import { journeys as client } from 'flix'
import moment from 'moment-timezone'
import settings from '../settings.js'
import isNull from 'lodash/isNull.js'

// send request
const journeys = (params, day) => {
	const dayTimestamp = +(moment.tz(day, settings.timezone).startOf('day'))
	return client(params.origin, params.destination, moment(day).toDate()).catch(console.error)
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
					(isNull(params.maxChanges) || params.maxChanges >= changes)
				)
			}),
		)
		.then(results => {
			for (const journey of results) {
				for (const leg of journey.legs) {
					if (leg.mode === 'train') leg.product = 'Zug'
					else leg.product = 'Bus'
				}
			}
			return results
		})
		.catch(err => {
			console.error(err)
			return []
		})
}

export default journeys
