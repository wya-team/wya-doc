const { EventEmitter } = require('events');
const path = require('path');
const fs = require('fs-extra');
const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');
const Config = require('./config');

class BuildProcess extends EventEmitter {
	constructor(ctx) {
		super();
		process.env.NODE_ENV = 'production';

		this.ctx = ctx;
		this.outDir = this.ctx.outDir;
	}

	/**
	 * 在渲染页面之前做一些事情，例如验证和清空输出目录
	 * webpack配置项
	 */
	async process() {
		this.overrideConfig = {
			output: {
				path: this.outDir,
			}
		};
	}

	/**
	 * Create dev server
	 * https://webpack.js.org/api/node/#webpack
	 * @returns {module.BuildProcess}
	 */
	async render() {
		let info = await new Promise((resolve, reject) => {
			webpack(Config.get('webpack', this.overrideConfig), (err, stats) => {
				if (err) {
					return reject(err);
				}
				if (stats.hasErrors()) {
					stats.toJson().errors.forEach(_err => {
						console.error(_err);
					});
					reject(new Error(`Failed to compile with errors.`));
					return;
				}
				if (stats.hasWarnings()) {
					stats.toJson().warnings.forEach(warning => {
						console.warn(warning);
					});
				}
				resolve(stats);
			});
		});
		// 输出日志
		console.log(info.toString({ colors: true }));
		return info;
	}
}

module.exports = BuildProcess;