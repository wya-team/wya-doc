const fs = require('fs-extra');
const path = require('path');
const DevProcess = require('./dev');
const BuildProcess = require('./build');

module.exports = class App {
	constructor(options = {}) {
		this.options = options;
		this.sourceDir = this.options.sourceDir || path.join(__dirname, 'docs.fallback');
		if (!fs.existsSync(this.sourceDir)) {
			throw new Error('error');
		}
		this.siteConfig = {};
		this.cwd = process.cwd();
		this.docDir = path.resolve(this.sourceDir, 'docs');
		
		const rawOutDir = this.options.dest || this.siteConfig.dest;

		this.outDir = rawOutDir
			? path.resolve(this.cwd, rawOutDir)
			: path.resolve(this.sourceDir, 'docs/dist');
	}

	/**
	 * 用于准备当前应用程序上下文的异步方法
	 * 其中包含加载页面和插件、应用插件等。
	 */
	async process() {
		// TODO
	}

	async dev() {
		this.isProd = false;
		this.devProcess = new DevProcess(this);
		await this.devProcess.process();
		const error = await new Promise(resolve => {
			try {
				this.devProcess
					// .on('fileChanged', ({ type, target }) => { })
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

	/**
	 * Launch a build process with current app context
	 *
	 * @returns {Promise<App>}
	 * @api public
	 */

	async build() {
		this.isProd = true;
		this.buildProcess = new BuildProcess(this);
		await this.buildProcess.process();
		await this.buildProcess.render();
		return this;
	}
};

