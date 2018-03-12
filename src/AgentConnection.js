import {BaseSocketConnection} from "./BaseSocketConnection";

/* Handlers
	- on-connect
	- context-found
	- search-results

   Actions
	   - put-update
	   - search
 */


export function AgentConnection(options = {}) {

	const name = options.name || 'Unnamed Agent'
	const route = (options.route || 'socket/agent/') + encodeURIComponent(name)

	const defaultOptions = {name, route}

	const socket = BaseSocketConnection({...defaultOptions, ...options})

	const _ConnectCallbacks = []
	const _ContextCallbacks = []
	const _StatusCallbacks = []
	const _SearchCallbacks = []

	socket.addEventListener('open', (data)=> {
		_ConnectCallbacks.forEach(i=> i(data))
	})

	const _handleMessage = (raw) => {
		console.log(raw)
		const message = JSON.parse(raw.data)
		switch (message.event) {
			case 'context-found':
				_ContextCallbacks.forEach(i=> i(message))
				break;

			case 'search-results':
				_SearchCallbacks.forEach(i=> i(message))
				break;

			case 'status-update':
				_StatusCallbacks.forEach(i=> i(message))
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
		},
		search: (query, lastProjectName, file, start, end) => {
			socket.send(JSON.stringify({event: 'search', query, lastProjectName, file, start, end}))
		},
		postChanges: (projectName, changes) => {
			socket.send(JSON.stringify({event: 'post-changes', projectName, changes}))
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

		onContextFound:(func)=> {
			if (typeof func === 'function') {
				_ContextCallbacks.push(func)
			}
		},

		onSearchResults:(func)=> {
			if (typeof func === 'function') {
				_SearchCallbacks.push(func)
			}
		},
		onStatusChange:(func)=> {
			if (typeof func === 'function') {
				_StatusCallbacks.push(func)
			}
		},
		actions
	}

	return connection

}