'use strict'

const params = require('./params')
const calendar = require('./calendar')
const template = require('./template')

const route = (req, res, next) => {
	const msg = 'Es ist ein Fehler bei der Abfrage der Daten aufgetreten. Bitte versuchen Sie es erneut oder kontaktieren Sie uns.'
	if(!req.query.submit) res.end(template(null, null))
	else{
		params(req.query).then(
			(params) => {
				if(!params) return res.status(400).end(template(null, msg))
				if(params.status=='error') return res.status(400).end(template(null, params.msg || msg))
				else
					return calendar(params.data).then(
						(cal) => {
							if(cal) return res.end(template({input: params.data, output: cal}, null))
							return res.status(400).end(template(null, 'Leider wurden keine Angebote gefunden, die den Suchkriterien entsprechen.'))
						},
						(error) => {console.error(error); return res.status(400).end(template(null, msg))}
					)
			},
			(error) => {
				return res.status(400).end(template(null, msg))
			}
		)
	}
}

module.exports = route
