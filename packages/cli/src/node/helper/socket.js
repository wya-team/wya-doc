const WebSocket = require('ws');


/**
 * TODO: ws和http保持同一端口
 */
module.exports = ({ port, host, server }) => {
	const wss = new WebSocket.Server({ port, host }, () => {
		console.log(`Wss Server: ws://${host}:${port}`);
	});

	let socketArr = [];
	wss.on('connection', (socket, request) => {
		socketArr.push(socket);

		console.log(`[event connection] - 连接数：${socketArr.length}`);
		// 服务端订阅
		socket.on('message', (res) => {
			console.log('log:', res);
		});

		socket.on('close', (res) => {
			socketArr = socketArr.filter(i => i != socket && i.readyState == 1);

			console.log(`[event close] - 连接数：${socketArr.length}`);
		});

		socket.on('error', (res) => {
			socket.close();

			console.log(`[event error]`, res);
		});
	});

	return {
		emit: (event, data) => {
			socketArr.forEach((it) => {
				it.readyState === 1 && it.send(JSON.stringify({
					event,
					data
				}));
			});
		}
	};
};
