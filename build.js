'use strict'

const config = require('config')
const cp = require('child_process')

cp.exec(`browserify assets/scripts/${config.api}.js > assets/scripts/bundle.js`)
