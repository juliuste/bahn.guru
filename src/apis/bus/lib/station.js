import { regions as stations } from 'flix'

const station = (s) => {
	// eslint-disable-next-line prefer-promise-reject-errors
	if (!s) return Promise.reject(false)
	return stations()
		.then(
			(data) => {
				const found = data.find(x => x.name === s)
				if (found) return found
				return false
			})
		.catch(
			// eslint-disable-next-line n/handle-callback-err
			(error) => false,
		)
}

export default station
