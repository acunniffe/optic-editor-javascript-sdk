import {BaseSocketConnection} from "./BaseSocketConnection";
/* Handlers
	- replace

   Actions
	- context
 */

export function EditorConnection(options = {}) {

	const name = options.name || 'Unknown Editor'
	const route = (options.route || 'socket/editor/') + encodeURIComponent(name)

	const defaultOptions = {name, route}

	const socket = BaseSocketConnection({...defaultOptions, ...options})

	const _ConnectCallbacks = []

	socket.addEventListener('open', (data)=> {
		_ConnectCallbacks.forEach(i=> i(data))
	})

	const _handleMessage = (raw) => {
		const message = JSON.parse(raw.data)
		switch (message.event) {
			default:
				console.log(message)
				console.warn(`Unknown message type '${message.event}' received`)
				break;
		}
	}

	socket.addEventListener('message', (data)=> _handleMessage(data))

	const actions = {
		context: (file, start, end, contents) => {
			socket.send(JSON.stringify({event: 'context', file, start, end, contents}))
		}
	}

	const connection = {
		socket,
		_handleMessage,
		isConnected: ()=> socket.connected,
		onConnect:(func)=> {
			if (typeof func === 'function') {
				_ConnectCallbacks.push(func)
			}
		},
		actions

	}

	return connection

}