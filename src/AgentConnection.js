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

	let _ConnectCallbacks = []
	let _ContextCallbacks = []
	let _StatusCallbacks = []
	let _KnowledgeGraphUpdateCallbacks = []
	let _ModelNodeOptionsUpdateCallbacks = []
	let _SearchCallbacks = []
	let _PostChangesResultsCallbacks = []
	let _SyncStagedCallbacks = []
	let _TransformationOptionsCallbacks = []
	let _OnCopyToClipBoardCallbacks = []
	let _OnErrorCallBacks = []
	let _CollectAllResultsCallbacks = []
	let _RuntimeAnalysisStartedCallbacks = []
	let _RuntimeAnalysisFinishedCallbacks = []
	let _SnapShotDeliveredCallbacks = []


	socket.addEventListener('error', (err) => {
		_OnErrorCallBacks.forEach(i=> i(err))
	})

	socket.addEventListener('open', (data)=> {
		_ConnectCallbacks.forEach(i=> i(data))
	})

	const _handleMessage = (raw) => {
		if (raw === 'pong') {
			return
		}
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

			case 'model-node-options-update':
				_ModelNodeOptionsUpdateCallbacks.forEach(i=> i(message))
				break;

			case 'post-changes-results':
				_PostChangesResultsCallbacks.forEach(i=> i(message))
				break;

			case 'transformation-options-found':
				_TransformationOptionsCallbacks.forEach(i=> i(message))
				break;

			case 'copy-to-clipboard':
				_OnCopyToClipBoardCallbacks.forEach(i=> i(message))
				break;

			case 'collect-all-results':
				_CollectAllResultsCallbacks.forEach(i=> i(message))
				break;

			case 'runtime-analysis-started':
				_RuntimeAnalysisStartedCallbacks.forEach(i=> i(message))
				break;

			case 'runtime-analysis-finished':
				_RuntimeAnalysisFinishedCallbacks.forEach(i=> i(message))
				break;
			case 'deliver-snapshot':
				_SnapShotDeliveredCallbacks.forEach(i=> i(message))
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
		postChanges: (changes, editorSlug) => {
			socket.send(JSON.stringify({event: 'post-changes', changes, editorSlug}))
		},
		getSyncPatch: (editorSlug) => {
			socket.send(JSON.stringify({event: 'get-sync-patch', editorSlug}))
		},
		getTransformationOptions: (transformationRef) => {
			socket.send(JSON.stringify({event: 'transformation-options', transformationRef}))
		},
		collectAll: (schema) => {
			socket.send(JSON.stringify({event: 'collect-all', schema}))
		},
		startRuntimeAnalysis: () => {
			socket.send(JSON.stringify({event: 'start-runtime-analysis'}))
		},
		finishRuntimeAnalysis: () => {
			socket.send(JSON.stringify({event: 'finish-runtime-analysis'}))
		},
		prepareSnapshot: () => {
			socket.send(JSON.stringify({event: 'prepare-snapshot'}))
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
		onSyncStaged:(func, unbindPrevious)=> {
			if (typeof func === 'function') {
				if (unbindPrevious) {
					_SyncStagedCallbacks = []
				}
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
		onNamedModelNodeOptionsUpdate:(func)=> {
			if (typeof func === 'function') {
				_ModelNodeOptionsUpdateCallbacks.push(func)
			}
		},
		onPostChangesResults:(func)=> {
			if (typeof func === 'function') {
				_PostChangesResultsCallbacks.push(func)
			}
		},
		onTransformationOptions:(func, unbindPrevious)=> {
			if (typeof func === 'function') {
				if (unbindPrevious) {
					_TransformationOptionsCallbacks = []
				}
				_TransformationOptionsCallbacks.push(func)
			}
		},
		onCopyToClipboard:(func)=> {
			if (typeof func === 'function') {
				_OnCopyToClipBoardCallbacks.push(func)
			}
		},
		onError:(func)=> {
			if (typeof func === 'function') {
				_OnErrorCallBacks.push(func)
			}
		},
		onCollectAllResults:(func)=> {
			if (typeof func === 'function') {
				_CollectAllResultsCallbacks.push(func)
			}
		},
		onRuntimeAnalysisStarted:(func)=> {
			if (typeof func === 'function') {
				_RuntimeAnalysisStartedCallbacks.push(func)
			}
		},
		onRuntimeAnalysisFinished:(func)=> {
			if (typeof func === 'function') {
				_RuntimeAnalysisFinishedCallbacks.push(func)
			}
		},
		onSnapshotDelivered:(func)=> {
			if (typeof func === 'function') {
				_SnapShotDeliveredCallbacks.push(func)
			}
		},
		actions
	}

	return connection

}
