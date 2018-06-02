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
	const _SyncStagedCallbacks = []
	const _StatusCallbacks = []
	const _KnowledgeGraphUpdateCallbacks = []
	const _SearchCallbacks = []
	const _PostChangesResultsCallbacks = []

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

			case 'sync-staged':
				_SyncStagedCallbacks.forEach(i=> i(message))
				break;

			case 'search-results':
				_SearchCallbacks.forEach(i=> i(message))
				break;

			case 'status-update':
				_StatusCallbacks.forEach(i=> i(message))
				break;

			case 'knowledge-graph-update':
				_KnowledgeGraphUpdateCallbacks.forEach(i=> i(message))
				break;

			case 'post-changes-results':
				_PostChangesResultsCallbacks.forEach(i=> i(message))
				break;

			default:
				console.warn(`Unknown message type '${message.event}' received`)
				break;
		}
	}

	socket.addEventListener('message', (data)=> _handleMessage(data))

	const actions = {
		putUpdate: (id, newValue, editorSlug) => {
			socket.send(JSON.stringify({event: 'put-update', id, newValue, editorSlug}))
		},
		search: (query, lastProjectName, editorSlug, file, start, end) => {
			socket.send(JSON.stringify({event: 'search', query, lastProjectName, editorSlug, file, start, end}))
		},
		postChanges: (projectName, editorSlug, changes) => {
			socket.send(JSON.stringify({event: 'post-changes', projectName, editorSlug, changes}))
		},
		getSyncPatch: (projectName, editorSlug) => {
			socket.send(JSON.stringify({event: 'get-sync-patch', projectName, editorSlug}))
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
		onSyncStaged:(func)=> {
			if (typeof func === 'function') {
				_SyncStagedCallbacks.push(func)
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
		onKnowledgeGraphUpdate:(func)=> {
			if (typeof func === 'function') {
				_KnowledgeGraphUpdateCallbacks.push(func)
			}
		},
		onPostChangesResults:(func)=> {
			if (typeof func === 'function') {
				_PostChangesResultsCallbacks.push(func)
			}
		},
		actions
	}

	return connection

}
