const fs = require('fs-extra');
const path = require('path');
const DevProcess = require('./dev');
const BuildProcess = require('./build');
const { generateRoutes } = require('./helper/index');

module.exports = class App {
	constructor(options = {}) {
		const defaultOptions = {
			withI18n: false,
			config: 'doc.config.js'
		};
		this.options = { ...defaultOptions, ...options };
		
		this.sourceDir = this.options.sourceDir || path.join(__dirname, 'docs.fallback');
		this.cwd = process.cwd();

		if (!fs.existsSync(this.sourceDir)) {
			throw new Error('error');
		}
	}


	/**
	 * 用于准备当前应用程序上下文的异步方法
	 * 其中包含加载页面和插件、应用插件等。
	 */
	async process() {
		let result = require(path.resolve(this.sourceDir, this.options.config));
		this.docConfig = typeof result === 'function' ? result() : result;

		return new Promise((resolve, reject) => {
			const { sourceDir } = this;
			const { i18n, routes } = this.docConfig;
			// 输出文件
			fs.outputFileSync(
				path.resolve(__dirname, '../client/src/routes.js'), 
				generateRoutes({
					sourceDir,
					routes, 
					i18n,
				}), 
				'utf-8'
			);

			resolve();
		});
	}

	async dev() {
		process.env.NODE_ENV = 'development';
		this.isProd = false;

		await this.process();
		this.devProcess = new DevProcess(this);
		await this.devProcess.process();
		
		const error = await new Promise(resolve => {
			try {
				this.devProcess
					.on('fileChanged', ({ type, target }) => { 
						this.process();
					})
					.createServer()
					.listen(resolve);
			} catch (err) {
				resolve(err);
			}
		});
		if (error) {
			throw error;
		}
		return this;
	}

	async build() {
		process.env.NODE_ENV = 'production';
		this.isProd = true;
		await this.process();

		this.buildProcess = new BuildProcess(this);
		await this.buildProcess.process();
		await this.buildProcess.render();
		return this;
	}
};

