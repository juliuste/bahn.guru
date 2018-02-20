'use strict'

const params = require('./params')
const template = require('./template')

const main = (req, res, next) => {
	params(req.query).then(data => {
		if(data.error) return res.status(400).send(template(data))
		return res.send(template(data))
	})
	.catch(error => {
		console.error(error)
		res.send(template())
	})
}

module.exports = main
