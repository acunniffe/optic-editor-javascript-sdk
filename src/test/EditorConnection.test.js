import assert from 'assert'
import {AgentConnection} from "../AgentConnection";
import {checkForSearch, EditorConnection} from "../EditorConnection";

describe('Editor Connection', ()=> {

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


	describe('search detection', () => {
	    it('will not match code without a tipple comment', ()=> {
	    	const testString = "code + code \n"

			assert(!checkForSearch(testString, 6, 6).isSearch)
		})

		it('will match code with a tipple comment', ()=> {
			const testString = "/// hello \n"

			const result = checkForSearch(testString, 8, 8)
			assert(result.isSearch)
			assert(result.query === "hello")
		})

		it('will not match code with a > 1 char selection', ()=> {
			const testString = "/// hello \n"

			const result = checkForSearch(testString, 8, 10)
			assert(!result.isSearch)
		})
	});

})
