import assert from 'assert'
import {DebuggerConnection} from "../DebuggerConnection";
import {AgentConnection} from "../AgentConnection";

describe('Debugger Connection', ()=> {

	it('can connect to server', (done)=> {
		const debuggerConnection = DebuggerConnection({name: 'optic-debugger'})
		debuggerConnection.onConnect(()=> {
			done()
		})
	})

	describe('handles', ()=> {

		const debuggerConnection = DebuggerConnection({name: 'optic-debugger'})
		it('debug-loading messages', (done) => {

			debuggerConnection.onDebugLoading(() => {
				done()
			})

			debuggerConnection._handleMessage({data: JSON.stringify({event: 'debug-loading'})})
		})

		it('search-results messages', (done) => {

			debuggerConnection.onDebugInformation(() => {
				done()
			})

			debuggerConnection._handleMessage({data: JSON.stringify({event: 'debug-information'})})
		})

	})

})