import createServer from './lib/index.js'

const port = (+process.env.PORT) || 3000

const server = createServer()

// start HTTP server
server.listen(port, error => {
	if (error) return console.error(error)
	console.log(`HTTP: Listening on port ${port}.`)
})
