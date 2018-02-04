'use strict'

const params = require('./params')
const day = require('./day')
const template = require('./template')

const main = (req, res, next) => {
	const msg = 'Es ist ein Fehler bei der Abfrage der Daten aufgetreten. Bitte versuchen Sie es erneut oder kontaktieren Sie uns.'
	params(req.query).then(
		(params) => {
			if(!params) return res.status(400).end(template(null, msg))
			if(params.status=='error') return res.status(400).end(template(null, params.msg || msg))
			else
				return day(params.data).then(
					(data) => {
						if(data) return res.send(template({input: params.data, output: data}, null))
						return res.status(400).send(template(null, 'Leider wurden keine Angebote gefunden, die den Suchkriterien entsprechen.'))
					},
					(error) => {console.error(error); return res.status(400).end(template(null, msg))}
				)
		},
		(error) => {
			return res.status(400).end(template(null, msg))
		}
	)
}

module.exports = main