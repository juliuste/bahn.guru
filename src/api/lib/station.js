import { createClient } from 'db-vendo-client'
import { profile } from 'db-vendo-client/p/db/index.js'

const { locations: stations } = createClient(profile, 'bahn.guru')

const station = (s) => {
	// eslint-disable-next-line prefer-promise-reject-errors
	if (!s) return Promise.reject(false)
	return stations(s)
		.then(
			(data) => {
				if (data.length > 0) return data[0]
				return false
			})
		.catch(
			// eslint-disable-next-line n/handle-callback-err
			(error) => false,
		)
}

const stationsAll = (s) => {
	if (!s) return Promise.resolve([])
	return stations(s)
		.then(data => Array.isArray(data) ? data : [])
		.catch(() => [])
}

export { stationsAll }

export default station
