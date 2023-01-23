import { createClient } from 'hafas-client'
import { profile as dbProfileRaw } from 'hafas-client/p/db/index.js'
import { parseHook } from 'hafas-client/lib/profile-hooks.js'
import { parseJourney as _parseJourney } from 'hafas-client/parse/journey.js'
import moment from 'moment-timezone'
import settings from '../settings.js'
import isNull from 'lodash/isNull.js'

const parseJourneyWithPrice = ({ parsed }, raw) => {
	parsed.price = null
	if (
		raw.trfRes &&
		Array.isArray(raw.trfRes.fareSetL) &&
		raw.trfRes.fareSetL[0] &&
		Array.isArray(raw.trfRes.fareSetL[0].fareL)
	) {
		const fare = raw.trfRes.fareSetL[0].fareL.filter(f => f.isBookable === true && f.isPartPrice === false)[0]
		if (fare && fare.price.amount > 0) {
			parsed.price = {
				amount: fare.price.amount / 100,
				currency: 'EUR',
				hint: null,
			}
		}
	}

	return parsed
}

const userAgent = 'bahn.guru'
const client = createClient({
	...dbProfileRaw,
	parseJourney: parseHook(_parseJourney, parseJourneyWithPrice),
}, userAgent)
const profile = client.profile

const fetchJourneys = async (from, to, opt = {}) => {
	from = profile.formatLocation(profile, from, 'from')
	to = profile.formatLocation(profile, to, 'to')

	if (('earlierThan' in opt) && ('laterThan' in opt)) {
		throw new TypeError('opt.earlierThan and opt.laterThan are mutually exclusive.')
	}
	if (('departure' in opt) && ('arrival' in opt)) {
		throw new TypeError('opt.departure and opt.arrival are mutually exclusive.')
	}

	opt = Object.assign({
		bahncard: null,
		class: 2,

		stopovers: false, // return stations on the way?
		transfers: -1, // maximum nr of transfers
		transferTime: 0, // minimum time for a single transfer in minutes
	}, opt)
	if (opt.via) opt.via = profile.formatLocation(profile, opt.via, 'opt.via')

	const when = new Date(opt.departure)
	if (Number.isNaN(+when)) throw new TypeError('opt.departure is invalid')

	const filters = [
		profile.formatProductsFilter({ profile }, opt.products || {}),
	]

	const query = {
		getPasslist: !!opt.stopovers,
		maxChg: opt.transfers,
		minChgTime: opt.transferTime,
		depLocL: [from],
		arrLocL: [to],
		jnyFltrL: filters,
		trfReq: {
			cType: 'PK',
			tvlrProf: [
				{
					type: 'E',
					...(opt.bahncard ? { redtnCard: opt.bahncard } : {}),
				},
			],
			jnyCl: opt.class,
		},
	}

	query.outDate = profile.formatDate(profile, when)
	query.outTime = profile.formatTime(profile, when)

	const { res, common } = await profile.request({ profile, opt }, userAgent, {
		cfg: { polyEnc: 'GPA' },
		meth: 'BestPriceSearch',
		// todo
		req: query,
		// req: profile.transformJourneysQuery({ profile, opt }, query),
	})
	if (!Array.isArray(res.outConL)) return []

	const ctx = { profile, opt, common, res }
	const journeys = res.outConL
		.map(j => profile.parseJourney(ctx, j))

	return journeys
}

const journeys = (params, day) => {
	const dayTimestamp = +(moment.tz(day, settings.timezone).startOf('day'))
	return fetchJourneys(params.origin.id, params.destination.id, {
		departure: moment(day).toDate(),
		class: params.class,
		bahncard: params.bc,
	})
		.then(results =>
			results.filter(j => {
				const plannedDeparture = new Date(j.legs[0].plannedDeparture)
				const plannedArrival = new Date(j.legs[j.legs.length - 1].plannedArrival)
				const duration = +plannedArrival - (+plannedDeparture)
				const changes = j.legs.length - 1
				return (
					(!params.duration || duration <= params.duration * 60 * 60 * 1000) &&
					(!params.departureAfter || +plannedDeparture >= +params.departureAfter + dayTimestamp) &&
					(!params.arrivalBefore || +plannedArrival <= +params.arrivalBefore + dayTimestamp) &&
					(isNull(params.maxChanges) || params.maxChanges >= changes) &&
					(j.legs.some(l => l.line && l.line.productName !== 'BUS')) &&
					(!!j.price)
				)
			}),
		)
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
