
let ws = new WebSocket("ws://localhost:7462/data")

ws.onopen = () => {
	console.log("connected")
}

ws.onmessage = (e) => {
	console.log(e)
	update_page(e.data)
}

const frame = document.querySelector("iframe")

let code = `
			const h = new Hydra().synth
			osc(4, 0.1, 1.2).scrollX(0.1, 0.1).out()
`

update_page(code)

function update_page(code) {
	frame.srcdoc = `
	<style>
		* {
			padding: 0;
			margin: 0;
		}

		html, body {
			height: 100%;
			width: 100%;
		}
	</style>

	<body></body>
	<script src="./lib/hydra.js"></script>
	<script>
		${code}
	</script>
`
}
