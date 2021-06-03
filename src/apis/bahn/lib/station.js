import createHafasClient from 'db-hafas'
const { locations: stations } = createHafasClient('bahn.guru')

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
			// eslint-disable-next-line node/handle-callback-err
			(error) => false,
		)
}

export default station
