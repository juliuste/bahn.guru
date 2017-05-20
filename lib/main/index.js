'use strict'

const params = require('./params')
const template = require('./template')

const main = (req, res, next) => {
	params(req.query).then(
		(data) => {
			if(data.error) return res.status(400).end(template(data))
			return res.end(template(data))
		},
		(error) => {
			return res.end(template())
		}
	)
	.catch(console.error)
}

module.exports = main
