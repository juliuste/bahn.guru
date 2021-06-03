import createServer from './lib/index.js'
import * as bahn from './apis/bahn/index.js'
import * as bus from './apis/bus/index.js'

const port = process.env.PORT || 3000
const apiId = process.env.API || 'bahn'

const apis = { bahn, bus }
const api = apis[apiId]
if (!api) throw new Error('Unknown api selected.')

const server = createServer(api)

// start HTTP server
server.listen(port, error => {
	if (error) return console.error(error)
	console.log(`HTTP: Listening on ${port}.`)
})
