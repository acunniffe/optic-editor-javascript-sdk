import {BaseSocketConnection} from "./BaseSocketConnection";
/* Handlers
	//none

   Actions
	- context
	- search
 */

export function DebuggerConnection(options = {}) {

	const name = options.name || 'Unknown Debugger'
	const route = (options.route || 'socket/debugger/') + encodeURIComponent(name)

	const defaultOptions = {name, route}

	const socket = BaseSocketConnection({...defaultOptions, ...options})

	const _ConnectCallbacks = []
	const _debugLoadingCallbacks = []
	const _debugInformationCallbacks = []

	socket.addEventListener('open', (data)=> {
		_ConnectCallbacks.forEach(i=> i(data))
	})

	const _handleMessage = (raw) => {
		try {
			const message = JSON.parse(raw.data)
			switch (message.event) {
				case 'debug-loading':
					_debugLoadingCallbacks.forEach(i=> i(message))
					break;
				case 'debug-information':
					_debugInformationCallbacks.forEach(i=> i(message))
					break;
				default:
					console.log(message)
					console.warn(`Unknown message type '${message.event}' received`)
					break;
			}
		} catch (e) {

		}
	}

	socket.addEventListener('message', (data)=> _handleMessage(data))

	const actions = {}

	const connection = {
		socket,
		_handleMessage,
		isConnected: ()=> socket.connected,
		onConnect:(func)=> {
			if (typeof func === 'function') {
				_ConnectCallbacks.push(func)
			}
		},
		onDebugLoading:(func)=> {
			if (typeof func === 'function') {
				_debugLoadingCallbacks.push(func)
			}
		},
		onDebugInformation:(func)=> {
			if (typeof func === 'function') {
				_debugInformationCallbacks.push(func)
			}
		},
		actions

	}

	return connection

}