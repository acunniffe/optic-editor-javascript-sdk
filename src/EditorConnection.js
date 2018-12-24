import {BaseSocketConnection} from "./BaseSocketConnection";
/* Handlers
	//none

   Actions
	- context
	- search
 */

export function EditorConnection(options = {}) {

	const name = options.name || 'Unknown Editor'

	const autorefreshes = options.autorefreshes === true

	const route = (options.route || 'socket/editor/') + encodeURIComponent(name) + `?autorefreshes=${autorefreshes}`

	const defaultOptions = {name, route}

	const socket = BaseSocketConnection({...defaultOptions, ...options})

	const _ConnectCallbacks = []
	const _FileUpdatedCallbacks = []

	socket.addEventListener('open', (data)=> {
		_ConnectCallbacks.forEach(i=> i(data))
	})

	const _handleMessage = (raw) => {
		try {
			const message = JSON.parse(raw.data)
			switch (message.event) {
				case 'files-updated':
					_FileUpdatedCallbacks.forEach(i=> i(message))
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

	const actions = {
		context: (file, start, end, contents) => {
			socket.send(JSON.stringify({event: 'context', file, start, end, contents}))
		},
		search: (file, start, end, query, contents) => {
			socket.send(JSON.stringify({event: 'search', file, start, end, query, contents}))
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
		onFilesUpdated:(func)=> {
			if (typeof func === 'function') {
				_FileUpdatedCallbacks.push(func)
			}
		},
		actions,
		_FileUpdatedCallbacks

	}

	return connection

}


const searchRegex = /^[\s]*\/\/\/[\s]*(.+)/
export function checkForSearch(line, start, end) {

	const match = searchRegex.exec(line)

	const isSearch = (start === end) && match !== null
	return {
		isSearch,
		query: (match !== null) ? match[1].trim() : undefined
	}

}
