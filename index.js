import { createWriteStream } from 'fs'
import { join, dirname } from 'path'
import createServer from './lib/index.js'
import * as bahn from './apis/bahn/index.js'
import * as bus from './apis/bus/index.js'
import { fileURLToPath } from 'url'

const port = process.env.PORT || 3000
const apiId = process.env.API || 'bahn'

const apis = { bahn, bus }
const api = apis[apiId]
if (!api) throw new Error('Unknown api selected.')

const logging = !!process.env.LOGGING
// create a write stream (in append mode) if logging is enabled
let accessLogStream
if (logging) accessLogStream = createWriteStream(join(dirname(fileURLToPath(import.meta.url)), `access-${apiId}.log`), { flags: 'a' })

const server = createServer({ api, accessLogStream })

// start HTTP server
server.listen(port, error => {
	if (error) return console.error(error)
	console.log(`HTTP: Listening on ${port}.`)
})
