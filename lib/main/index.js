'use strict'

const params = require('./params')
const template = require('./template')

const main = (req, res, next) => {
	params(req.query).then(
		(data) => {
			if(data.error) return res.status(400).send(template(data))
			return res.send(template(data))
		},
		(error) => {
			return res.send(template())
		}
	)
	.catch(console.error)
}

module.exports = main
