const path = require('path');
const fs = require('fs-extra');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');
const merge = require('webpack-merge');
const VueLoaderPlugin = require('vue-loader/lib/plugin');
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin');

const { resolve } = path;
const cwd = process.cwd();

const r = (source) => {
	let fullpath;

	fullpath = resolve(__dirname, '../node_modules', source);
	if (fs.pathExistsSync(fullpath)) {
		return fullpath;
	}
	
	fullpath = resolve(cwd, './node_modules', source);
	if (fs.pathExistsSync(fullpath)) {
		return fullpath;
	}

	fullpath = resolve(cwd, '../../node_modules', source);
	if (fs.pathExistsSync(fullpath)) {
		return fullpath;
	}

	throw new Error(`@wya/doc: 未找到${source}`);
};

class Config {
	constructor(type, parent) {

		this.$parent = parent;

		this.result = type === 'webpack' || type === true 
			? this.generateDefault()
			: this.generateServer();
	}

	/**
	 * 针对@wya/vc有做特殊处理
	 */
	generateDefault() {
		let { port, host } = this.$parent;
		const { docConfig = {}, sourceDir, browserDir } = this.$parent.$parent;
		const { webpackConfig, runtime, locales, layout, externalResources, } = docConfig || {};
		const { __DOC_MD_DIR__: baseMDDir, __DOC_SITE_DIR__, __DOC_VERSION__ } = runtime.define || {};
		const { devServer, ...override } = webpackConfig || {};
		const ENV_IS_DEV = process.env.NODE_ENV === 'development';

		let __DEP_VC__ = false;
		if (
			override.resolve 
			&& override.resolve.alias
			&& Object.keys(override.resolve.alias).some(i => i.includes('@wya/vc'))
		) {
			__DEP_VC__ = true;
		}
		const exclude = new RegExp(resolve(__dirname, '../node_modules'));
		const defaultOptions = {
			mode: process.env.NODE_ENV,
			devtool: ENV_IS_DEV ? 'cheap-module-eval-source-map' : undefined,
			// 生成文件，是模块构建的终点
			output: {
				path: resolve(__dirname, '../dist'),
				filename: `js/[name].bundle.js`, // 每个页面对应的主js的生成配置
				chunkFilename: `js/[name].chunk.js`, // chunk生成的配置
				sourceMapFilename: `js/[name].bundle.map`,
				publicPath: '/',
			},
			// resolve
			resolve: {
				modules: [
					...module.paths,
					process.cwd(),
					resolve(__dirname, '../node_modules')
				],
				extensions: ['.vue', '.js', '.json', '.md', '.css', '.scss'],
				symlinks: true,
				alias: {
					'vue$': r('vue/dist/vue.esm.js'),
					'babel-runtime': r('@babel/runtime'),
					'@assets': resolve(__dirname, '../client/src/assets'),
					'@style': resolve(__dirname, '../client/src/style'),
					'@components': resolve(__dirname, '../client/src/components'),
					'@utils': resolve(__dirname, '../client/src/utils'),
					'@client': resolve(__dirname, '../client'),
					'@app': resolve(__dirname, '../client'),
				}
			},

			// resolve loader
			"resolveLoader": {
				symlinks: true,
				modules: [
					...module.paths,
					resolve(__dirname, '../node_modules')
				] 
			},
			module: {
				rules: [
					{
						test: /\.js$/,
						// exclude: /node_modules/,
						exclude,
						use: {
							loader: r('babel-loader'),
							options: {
								// 不使用sourceDir本地配置
								babelrc: false,
								configFile: false,

								compact: false,
								cacheDirectory: true,
								presets: [
									r('@babel/preset-env')
								],
								plugins: [
									r('@babel/plugin-proposal-export-namespace-from'),
									r('@babel/plugin-proposal-export-default-from'),
									r('@babel/plugin-proposal-function-bind'),
									r('@babel/plugin-syntax-dynamic-import'),
									r('@babel/plugin-transform-modules-commonjs'),
									r('@babel/plugin-syntax-jsx'),
									r('babel-plugin-transform-vue-jsx'),
									[
										r('@babel/plugin-proposal-decorators'),
										{
											"legacy": true
										}
									],
									[	
										r('@babel/plugin-proposal-class-properties'),
										{
											"loose": true
										}
									]
								]
							}
						}
					},
					{
						test: /\.vue$/,
						// exclude: /node_modules/,
						exclude,
						loader: r('vue-loader'),
					},     
					{
						test: /\.(scss|css)$/,
						use: [
							r('vue-style-loader'),
							r('css-loader'),
							r('sass-loader'),
							{
								loader: r('sass-resources-loader'),
								options: {
									resources: [
										resolve(__dirname, "../client/style/themes/var.scss"),
										r("@wya/sass/lib/mixins/bem.scss")
									]
								}
							}
						]
					},
					{
						test: /\.(png|jpg|gif|eot|ttf|woff|woff2|svg)$/,
						loader: r('url-loader')
					},
					{
						test: /\.md$/,
						use: [
							{ 
								loader: r("html-loader"),
								options: {
									minimize: false // 如果被压缩了，就无法正常解析了
								}
							}
						]
					}
				]
			},
			plugins: [
				new VueLoaderPlugin(),
				new HtmlWebpackPlugin({
					__DEV__: ENV_IS_DEV, 
					// TODO: 是否考虑针对dev也开放
					externalResources: ENV_IS_DEV 
						? ''
						: externalResources || [
							'//unpkg.com/@wya/vc/lib/vc.min.css',
							'//unpkg.com/@wya/vc/lib/vc.min.js'
						],
					template: resolve(__dirname, '../client/static/index.tpl.html'),
					inject: 'body',
					filename: './index.html',
				}),
				new FriendlyErrorsPlugin({
					compilationSuccessInfo: {
						messages: ['success!!!']
					}
				}),
				new webpack.DefinePlugin({
					__DEP_VC__, 
					__DEV__: JSON.stringify(ENV_IS_DEV),
					__DOC_LOCALES__: JSON.stringify(locales),
					__DOC_LAYOUT__: JSON.stringify(layout || {}),
					__DOC_SOCKET__: `'ws://${host}:${++port}'`,
					__DOC_SITE_DIR__: `'${__DOC_SITE_DIR__ || '/'}'`,
					__DOC_VERSION__: `'${__DOC_VERSION__ || '1.0.0'}'`,
					__DOC_MD_DIR__: typeof baseMDDir === 'function' 
						? baseMDDir
						: baseMDDir 
							? `'${baseMDDir}'` 
							: `'/'`
				})
			],
			externals: ENV_IS_DEV 
				? {}
				: {
					vue: 'Vue',
					lodash: '_',
					'@babel/standalone': 'Babel',
					'@babel/preset-env-standalone': 'BabelPresetEnv',
					'@wya/vc': 'WYA_VC',
				}
		};

		// 不允许被覆盖的配置
		const noOverrideConfig = {
			// 入口文件，是模块构建的起点
			entry: [browserDir, resolve(__dirname, '../client/index.js')].filter(i => !!i),
		};

		return merge(defaultOptions, override, noOverrideConfig);
	}

	generateServer() {
		const { port, host } = this.$parent;
		const { docConfig = {}, sourceDir } = this.$parent.$parent;
		const { devServer = {} } = docConfig.webpackConfig || {};

		return merge({
			hot: true,
			quiet: true,
			historyApiFallback: true,
			publicPath: '/',
			contentBase: path.resolve(sourceDir, "../"),
			port,
			host
		}, devServer);
	}
	
}
module.exports = {
	get(type = 'webpack', parent) {
		return new Config(type, parent).result;
	}
};