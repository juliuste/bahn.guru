const createParseParams = api => async (rawParams, opt) => {
	const { stationsOptional } = opt || {}
	const parsed = {
		params: api.params(rawParams),
		error: false,
	}

	try {
		const [origin, destination] = await Promise.all([
			// eslint-disable-next-line node/handle-callback-err
			api.station(rawParams.origin).catch(error => null),
			// eslint-disable-next-line node/handle-callback-err
			api.station(rawParams.destination).catch(error => null),
		])
		if (!stationsOptional && (!origin || !destination)) throw new Error('invalid stations')
		if (origin) parsed.params.origin = origin
		if (destination) parsed.params.destination = destination
	} catch (error) {
		parsed.error = 'invalid-stations'
	}

	return parsed
}

export default createParseParams
