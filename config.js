'use strict'

const config = require('config')

config.api = process.env.API || 'bahn'
config.port = process.env.PORT || 3009
config.timezone = process.env.TIMEZONE || 'Europe/Berlin'

module.exports = config
