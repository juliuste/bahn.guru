import { createClient } from 'hafas-client'
import { profile as dbProfileRaw } from 'hafas-client/p/db/index.js'
import moment from 'moment-timezone'
import settings from '../settings.js'
import isNull from 'lodash/isNull.js'

const userAgent = 'bahn.guru'
const client = createClient(dbProfileRaw, userAgent)
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

		results: null, // number of journeys – `null` means "whatever HAFAS returns"
		via: null, // let journeys pass this station?
		stopovers: false, // return stations on the way?
		transfers: -1, // maximum nr of transfers
		transferTime: 0, // minimum time for a single transfer in minutes
		// todo: does this work with every endpoint?
		accessibility: 'none', // 'none', 'partial' or 'complete'
		bike: false, // only bike-friendly journeys
		walkingSpeed: 'normal', // 'slow', 'normal', 'fast'
		// Consider walking to nearby stations at the beginning of a journey?
		startWithWalking: true,
		tickets: false, // return tickets?
		polylines: false, // return leg shapes?
		subStops: false, // parse & expose sub-stops of stations?
		entrances: false, // parse & expose entrances of stops/stations?
		remarks: false, // parse & expose hints & warnings?
		scheduledDays: false, // parse & expose dates each journey is valid on?
	}, opt)
	if (opt.via) opt.via = profile.formatLocation(profile, opt.via, 'opt.via')

	let when = new Date(); let outFrwd = true
	if (opt.departure !== undefined && opt.departure !== null) {
		when = new Date(opt.departure)
		if (Number.isNaN(+when)) throw new TypeError('opt.departure is invalid')
	} else if (opt.arrival !== undefined && opt.arrival !== null) {
		if (!profile.journeysOutFrwd) {
			throw new Error('opt.arrival is unsupported')
		}
		when = new Date(opt.arrival)
		if (Number.isNaN(+when)) throw new TypeError('opt.arrival is invalid')
		outFrwd = false
	}

	const filters = [
		profile.formatProductsFilter({ profile }, opt.products || {}),
	]
	if (
		opt.accessibility &&
		profile.filters &&
		profile.filters.accessibility &&
		profile.filters.accessibility[opt.accessibility]
	) {
		filters.push(profile.filters.accessibility[opt.accessibility])
	}

	if (!['slow', 'normal', 'fast'].includes(opt.walkingSpeed)) {
		throw new Error('opt.walkingSpeed must be one of these values: "slow", "normal", "fast".')
	}
	const gisFltrL = []
	if (profile.journeysWalkingSpeed) {
		gisFltrL.push({
			meta: 'foot_speed_' + opt.walkingSpeed,
			mode: 'FB',
			type: 'M',
		})
	}

	const query = {
		getPasslist: !!opt.stopovers,
		maxChg: opt.transfers,
		minChgTime: opt.transferTime,
		depLocL: [from],
		viaLocL: opt.via ? [{ loc: opt.via }] : [],
		arrLocL: [to],
		jnyFltrL: filters,
		gisFltrL,
		// getTariff: !!opt.tickets,
		trfReq: {
			cType: 'PK',
			tvlrProf: [
				{
					type: 'E',
					redtnCard: opt.bahncard || undefined,
				},
			],
			jnyCl: opt.class,
		},
		// todo: this is actually "take additional stations nearby the given start and destination station into account"
		// see rest.exe docs
		ushrp: !!opt.startWithWalking,

		getPT: true, // todo: what is this?
		getIV: false, // todo: walk & bike as alternatives?
		getPolyline: !!opt.polylines,
		// todo: `getConGroups: false` what is this?
		// todo: what is getEco, fwrd?
	}

	query.outDate = profile.formatDate(profile, when)
	query.outTime = profile.formatTime(profile, when)

	if (opt.results !== null) query.numF = opt.results
	if (profile.journeysOutFrwd) query.outFrwd = outFrwd

	const { res, common } = await profile.request({ profile, opt }, userAgent, {
		cfg: { polyEnc: 'GPA' },
		meth: 'BestPriceSearch',
		req: profile.transformJourneysQuery({ profile, opt }, query),
	})
	if (!Array.isArray(res.outConL)) return []
	// todo: outConGrpL

	const ctx = { profile, opt, common, res }
	const journeys = res.outConL
		.map(j => profile.parseJourney(ctx, j))

	return {
		earlierRef: res.outCtxScrB,
		laterRef: res.outCtxScrF,
		journeys,
		realtimeDataUpdatedAt: res.planrtTS && res.planrtTS !== '0'
			? parseInt(res.planrtTS)
			: null,
	}
}

const journeys = (params, day) => {
	const dayTimestamp = +(moment.tz(day, settings.timezone).startOf('day'))
	return fetchJourneys(params.origin.id, params.destination.id, moment(day).toDate(), {
		class: params.class,
		bahncard: params.bc,
		// travellers: [{ typ: 'E', bc: params.bc }],
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
