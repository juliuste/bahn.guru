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
	params(req.query).then(params => {
		if(!params) {
			console.error("no params")
			error('1')
		}
		if(params.status==='error') error(params.msg ? 'noStations' : '1')
		else
			return calendar(params.data).then(data => {
				console.log("template stage!")
				if(data) return res.send(template({input: params.data, output: data}, null))
				error('noResults')
			}).catch(err => {console.error("error2" + err);error('1')})
	})
	.catch(err => {console.error("error3");error('1')})
}

module.exports = main
