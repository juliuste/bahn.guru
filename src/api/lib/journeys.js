import { profile as dbProfileRaw } from 'db-vendo-client/p/db/index.js'
import moment from 'moment-timezone'
import settings from '../settings.js'
import isNull from 'lodash/isNull.js'
import { createClient } from 'db-vendo-client'

const userAgent = 'bahn.guru'
const client = createClient(dbProfileRaw, userAgent)

const journeys = (params, day) => {
	const dayTimestamp = +(moment.tz(day, settings.timezone).startOf('day'))
	return client.journeys(params.origin.id, params.destination.id, {
		departure: moment(day).toDate(),
		class: params.class,
		bahncard: params.bc,
		ageGroup: (params.age === 'Y') ? 'Y' : 'E',
	})
		.then(response => {
			const results = response.journeys || []
			return results.filter(j => {
				const plannedDeparture = new Date(j.legs[0].plannedDeparture)
				const plannedArrival = new Date(j.legs[j.legs.length - 1].plannedArrival)
				const duration = +plannedArrival - (+plannedDeparture)

				let changes = 0
				let lastName = null
				for (const leg of j.legs) {
					if (leg !== j.legs[j.legs.length - 1]) {
						if (leg.destination.name !== lastName) {
							changes++
							lastName = leg.destination.name
						}
					}
				}

				return (
					(!params.duration || duration <= params.duration * 60 * 60 * 1000) &&
					(!params.departureAfter || +plannedDeparture >= +params.departureAfter + dayTimestamp) &&
					(!params.arrivalBefore || +plannedArrival <= +params.arrivalBefore + dayTimestamp) &&
					(isNull(params.maxChanges) || params.maxChanges >= changes) &&
					(j.legs.some(l => l.line && l.line.productName !== 'BUS')) &&
					(!!j.price)
				)
			})
		})
		.then(results => {
			for (const journey of results) {
				for (const leg of journey.legs) {
					leg.product = leg.line ? leg.line.productName : null
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
