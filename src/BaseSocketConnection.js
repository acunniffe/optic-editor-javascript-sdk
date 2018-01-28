import ReconnectingWebSocket from 'reconnecting-websocket'
import WebSocket from 'ws'

const hasGlobalWebSocket = typeof(window) !== 'undefined' && !!window.WebSocket

export function BaseSocketConnection(options = {}) {
	const host = options.host || 'localhost'
	const port = options.port || 30333
	const route = options.route || ''

	const url = `ws://${host}:${port}/${route}`

	const defaultOptions = {
		constructor: (hasGlobalWebSocket) ?  window.WebSocket : WebSocket,
		maxReconnectionDelay: 10000,
		minReconnectionDelay: 1500,
		reconnectionDelayGrowFactor: 1.3,
		connectionTimeout: 4000,
		maxRetries: Infinity,
		debug: false,
	};

	const rws = new ReconnectingWebSocket(url, [], defaultOptions)

	return rws
}
