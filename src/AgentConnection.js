import {BaseSocketConnection} from "./BaseSocketConnection";

/* Handlers
	- context-found
	- configuration
	- search-results

   Actions
	   - update-model
	   - insert
 */


export function AgentConnection(options = {}) {

	const name = options.name || 'Unnamed Agent'
	const route = (options.route || 'socket/agent/') + encodeURIComponent(name)

	const defaultOptions = {name, route}

	const socket = BaseSocketConnection({...defaultOptions, ...options})

	const _ConnectCallbacks = []
	const _ContextCallbacks = []

	socket.addEventListener('open', (data)=> {
		_ConnectCallbacks.forEach(i=> i(data))
	})

	const _handleMessage = (raw) => {
		const message = JSON.parse(raw.data)
		switch (message.event) {
			case 'context-found':
				_ContextCallbacks.forEach(i=> i(message))
				break;

			default:
				console.warn(`Unknown message type '${message.event}' received`)
				break;
		}
	}

	socket.addEventListener('message', (data)=> _handleMessage(data))

	const actions = {
		putUpdate: (id, newValue) => {
			socket.send(JSON.stringify({event: 'put-update', id, newValue}))
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

		_ContextCallbacks: [],
		onContextFound:(func)=> {
			if (typeof func === 'function') {
				_ContextCallbacks.push(func)
			}
		},
		actions
	}

	return connection

}