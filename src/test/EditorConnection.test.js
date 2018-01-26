import assert from 'assert'
import {AgentConnection} from "../AgentConnection";
import {EditorConnection} from "../EditorConnection";

describe('Agent Connection', ()=> {

	it('can connect to agent server', (done)=> {
		const editorConnection = EditorConnection({name: 'sublime'})
		editorConnection.onConnect(()=> {
			done()
		})
	})

	it('can send a context update to server', (done)=> {
		const editorConnection = EditorConnection({name: 'sublime'})
		editorConnection.onConnect(()=> {
			editorConnection.actions.context('hello/world', 12, 15, "contents")
			done()
		})
	})

})