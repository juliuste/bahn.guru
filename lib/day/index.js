'use strict'

const params = require('./params')
const day = require('./day')
const template = require('./template')

const forward = (req, next) => (code) => {
	req.query.error = code
	next()
}

const main = (req, res, next) => {
	const error = forward(req, next)
	params(req.query).then(params => {
		if(!params) error('1')
		if(params.status=='error') error('1')
		else
			return day(params.data)
			.then(data => {
				if(data) return res.send(template({input: params.data, output: data}))
				return error('noResults')
			})
			.catch(err => {
				console.error(err)
				error('1')
			})
	})
	.catch(err => {
		console.log(err)
		error('1')
	})
}

module.exports = main
