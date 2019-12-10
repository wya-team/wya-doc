const fs = require('fs-extra');
const path = require('path');
const { inspect } = require('util');
const DevProcess = require('./dev');
const BuildProcess = require('./build');
const { genRoutes } = require('./utils');

module.exports = class App {
	constructor(options = {}) {
		const defaultOptions = {
			withI18n: false,
			config: 'doc.config.js'
		};
		this.options = { ...defaultOptions, ...options };
		
		this.sourceDir = this.options.sourceDir || path.join(__dirname, 'docs.fallback');
		if (!fs.existsSync(this.sourceDir)) {
			throw new Error('error');
		}
		const configFilePath = path.resolve(this.sourceDir, this.options.config);
		this.docConfig = require(configFilePath);

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
		return new Promise((resolve, reject) => {
			const { i18n, nav } = this.docConfig;
			const routes = genRoutes(this.docConfig.routes, this.docDir, i18n);
			const content = `export default ${routes};`;

			try {
				// 将生成的路由配置写入client下
				const routeDest = path.resolve(__dirname, '../client/src/routes.js');
				fs.outputFileSync(routeDest, content, 'utf-8');

				// 复制左侧导航配置到client下
				let sideNav = '';
				if (typeof nav.side === 'string') { // 传入文件路径
					const ext = path.extname(nav.side);
					const sideFrom = path.resolve(this.sourceDir, nav.side);
					sideNav = fs.readFileSync(sideFrom, 'utf-8');
					if (ext === '.json') {
						sideNav = `export default ${sideNav}`;
					}
				} else { // 直接传入导航配置对象
					sideNav = `export default ${JSON.stringify(nav.side)}`;
				}
				
				const sideDest = path.resolve(__dirname, '../client/src/nav-side.js');
				fs.writeFileSync(sideDest, sideNav, 'utf-8');
			} catch (error) {
				reject(new Error(error));
				return;
			}
			
			// 如果提供了header的导航配置，则也复制一份到client下
			if (nav.header) {
				const headerFrom = path.resolve(this.sourceDir, nav.header);
				const headerDest = path.resolve(__dirname, '../client/src/nav-header.json');
				fs.copyFileSync(headerFrom, headerDest);
			}
			resolve();
		});
	}

	async dev() {
		this.isProd = false;
		await this.process();
		this.devProcess = new DevProcess(this);
		await this.devProcess.process();
		const error = await new Promise(resolve => {
			try {
				const { devServer, ...rest } = this.docConfig.webpackConfig;
				this.devProcess
					// .on('fileChanged', ({ type, target }) => { })
					.createServer(rest, devServer)
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

