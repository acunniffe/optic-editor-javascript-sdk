import assert from 'assert'
import {BaseSocketConnection} from '../BaseSocketConnection';
import WebSocket from 'ws'

describe('Base Socket Connections', ()=> {

	const wss = new WebSocket.Server({ port: 8080 });

	wss.broadcast = function broadcast(data) {
		wss.clients.forEach(function each(client) {
			if (client.readyState === WebSocket.OPEN) {
				client.send(data);
			}
		});
	};

	it('can connect to server', (done)=> {
		const ws = BaseSocketConnection({port: 8080})

		ws.addEventListener('open', ()=> {
			done()
		});

	})

	it('can receive data', (done)=> {
		const ws = BaseSocketConnection({port: 8080})

		ws.addEventListener('message', (data)=> {
			done()
		})

		setTimeout(()=>{
			wss.broadcast(JSON.stringify({type: 'test'}))
		}, 250)

	})

})