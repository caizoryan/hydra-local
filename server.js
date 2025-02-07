import express from "express"
import expressWs from "express-ws"
import cors from "cors"

import process from "process"
import path from "path"

import watch from "node-watch"

import fs from "fs"

watch('./hyrda.js', { recursive: true }, function(evt, name) {
	let code = fs.readFileSync("./hyrda.js", { encoding: 'utf8', flag: 'r' })
	console.log(code)
	updateSockets(code)
});

const app = express()
expressWs(app)

app.use(cors())

let sockets = {}

app.ws('/data', function(ws, req) {
	console.log('socket connected')
	let uid = Math.random() * Date.now()
	sockets[uid] = ws

	ws.on('message', function(msg) {
		console.log(msg)
		Object.keys(sockets).forEach((key) => {
			sockets[key].send("connected")
		})
	});
});

app.get('/', (req, res) => {
	console.log('GET /')

	const options = { root: path.join(process.cwd()) };
	res.sendFile("index.html", options)
})

app.get('/script.js', (req, res) => {
	console.log('GET / Script')
	const options = { root: path.join(process.cwd()) };
	res.sendFile("script.js", options)
})

app.get('/lib/hydra.js', (req, res) => {
	console.log('GET / Script')
	const options = { root: path.join(process.cwd()) };
	res.sendFile("/lib/hydra.js", options)
})

let port = 7462
app.listen(port, () => {
	console.log(`Server running on port ${port}`)
})

function updateSockets(code) {
	Object.keys(sockets).forEach((key) => {
		sockets[key].send(code)
	})
}

