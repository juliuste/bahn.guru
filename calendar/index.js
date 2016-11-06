'use strict'

const params = require('./params')
const calendar = require('./calendar')
const template = require('./template')

const forward = (req, next) => (code) => {
	req.query.error = code
	next()
}

const main = (req, res, next) => {
	const error = forward(req, next)
	params(req.query).then(
		(params) => {
			if(!params) error('1')
			if(params.status=='error') error((params.msg)?'noStations' : '1')
			else
				return calendar(params.data).then(
					(data) => {
						if(data) return res.end(template({input: params.data, output: data}, null))
						error('noResults')
					},
					(error) => {console.error(error); error('1')}
				)
		},
		(error) => {
			error('1')
		}
	)
}

module.exports = main