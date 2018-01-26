import WebSocket from 'ws'
import ReconnectingWebSocket from 'reconnecting-websocket'


export function BaseSocketConnection(options = {}) {
	const host = options.host || 'localhost'
	const port = options.port || 30333
	const route = options.route || ''

	const url = `ws://${host}:${port}/${route}`

	const rws = new ReconnectingWebSocket(url, null)

	return rws
}