const { EventEmitter } = require('events');
const path = require('path');
const webpack = require('webpack');
const portfinder = require('portfinder');
const WebpackDevServer = require('webpack-dev-server');
const Config = require('./config');
const { localhost } = require('./helper');


class DevProcess extends EventEmitter {
	constructor(parent) {
		super();
		process.env.NODE_ENV = 'development';

		this.$parent = parent;
		this.port = 8080;
		this.host = localhost;
	}

	/**
	 * 为启动dev服务器准备必要的数据
	 */
	async process() {
		this.watchSourceFiles();

		await this.resolvePort();
		await this.resolveHost();
		
		return this;
	}

	watchSourceFiles() {
		// TODO	
		// () => {
		// 	this.emit('fileChanged', {
		// 		type,
		// 		target
		// 	});
		// };	
	}

	async resolvePort() {
		let port = this.$parent.options.port || this.port;
		
		portfinder.basePort = parseInt(port, 10);
		port = await portfinder.getPortPromise();

		this.port = port;
	}

	async resolveHost() {
		this.host = this.$parent.options.host || this.host;
	}

	/**
	 * Create dev server
	 * https://github.com/webpack/webpack-dev-server/blob/master/examples/api/simple/server.js
	 * https://webpack.js.org/guides/development/#using-webpack-dev-middleware
	 * @returns {module.DevProcess}
	 */
	createServer() {
		const compiler = webpack(Config.get('webpack', this));
		let server = new WebpackDevServer(
			compiler, 
			Config.get('server', this)
		);

		this.server = server;
		return this;
	}

	listen(callback) {
		this.server.listen(this.port, this.host, (err) => {
			if (typeof callback === 'function') {
				callback(err);
			}
		});
		return this;
	}
}

module.exports = DevProcess;