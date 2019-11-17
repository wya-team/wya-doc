const { EventEmitter } = require('events');
const webpack = require('webpack');
const portfinder = require('portfinder');
const WebpackDevServer = require('webpack-dev-server');
const Config = require('./config');

class DevProcess extends EventEmitter {
	constructor(ctx) {
		super();
		process.env.NODE_ENV = 'development';

		this.ctx = ctx;
		this.port = 8080;
		this.host = '0.0.0.0';
	}

	/**
	 * 为启动dev服务器准备必要的数据
	 */
	async process() {
		await this.resolvePort();
		await this.resolveHost();
		return this;
	}

	async resolvePort() {
		let port = this.ctx.options.port || this.ctx.siteConfig.port || this.port;
		
		portfinder.basePort = parseInt(port, 10);
		port = await portfinder.getPortPromise();

		this.port = port;
	}

	async resolveHost() {
		this.host = this.ctx.options.host || this.ctx.siteConfig.host || this.host;
	}

	/**
	 * Create dev server
	 * https://github.com/webpack/webpack-dev-server/blob/master/examples/api/simple/server.js
	 * https://webpack.js.org/guides/development/#using-webpack-dev-middleware
	 * @returns {module.DevProcess}
	 */
	createServer() {
		const compiler = webpack(Config.get('webpack'));
		let server = new WebpackDevServer(
			compiler, 
			Config.get('server')
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