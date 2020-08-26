const path = require('path');
const fs = require('fs-extra');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');
const merge = require('webpack-merge');
const VueLoaderPlugin = require('vue-loader/lib/plugin');
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin');

const { resolve } = path;
const cwd = process.cwd();

const BASIC_NMS = [
	resolve(__dirname, '../node_modules'),
	resolve(cwd, './node_modules'),
	resolve(cwd, '../../node_modules')
];
const NMS = [
	...BASIC_NMS,
	// 增加编译速度
	...module.paths
];

const resolvePackage = (source) => {
	let $path = NMS.find(i => fs.pathExistsSync(resolve(i, source)));

	if (!$path) {
		throw new Error(`@wya/doc: 未找到${source}`);
	}

	return resolve($path, source);
};
const resolveClient = (source) => {
	return resolve(__dirname, '../client', source || '');
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
		const exclude = new RegExp(`(${BASIC_NMS.join('|')})`);

		// 不允许被覆盖的配置
		const noOverrideConfig = {
			entry: [browserDir, resolveClient('index.js')].filter(i => !!i),
		};

		const defaultOptions = {
			mode: process.env.NODE_ENV,
			devtool: ENV_IS_DEV ? 'cheap-module-eval-source-map' : undefined,
			output: {
				path: resolve(__dirname, '../dist'),
				filename: `js/[name].bundle.js`,
				chunkFilename: `js/[name].chunk.js`,
				sourceMapFilename: `js/[name].bundle.map`,
				publicPath: '/',
			},
			resolve: {
				modules: NMS,
				extensions: ['.vue', '.js', '.json', '.md', '.css', '.scss'],
				symlinks: true,
				alias: {
					'vue$': resolvePackage('vue/dist/vue.esm.js'),
					'babel-runtime': resolvePackage('@babel/runtime'),
					'@assets': resolveClient('src/assets'),
					'@style': resolveClient('src/style'),
					'@components': resolveClient('src/components'),
					'@utils': resolveClient('src/utils'),
					'@client': resolveClient(),
					'@app': resolveClient(),
					'@wya/doc-utils': resolvePackage('@wya/doc-utils/src/index.js'),
					'@wya/doc-playground': resolvePackage('@wya/doc-playground/src/index.js'),
				}
			},
			module: {
				rules: [
					{
						test: /\.js$/,
						exclude,
						use: {
							loader: resolvePackage('babel-loader'),
							options: {
								babelrc: false,
								configFile: false,
								compact: false,
								cacheDirectory: true,
								presets: [
									resolvePackage('@babel/preset-env')
								],
								plugins: [
									resolvePackage('@babel/plugin-proposal-export-namespace-from'),
									resolvePackage('@babel/plugin-proposal-export-default-from'),
									resolvePackage('@babel/plugin-proposal-function-bind'),
									resolvePackage('@babel/plugin-syntax-dynamic-import'),
									resolvePackage('@babel/plugin-transform-modules-commonjs'),
									resolvePackage('@babel/plugin-syntax-jsx'),
									resolvePackage("@babel/plugin-transform-runtime"),
									resolvePackage('babel-plugin-transform-vue-jsx'),
									[
										resolvePackage('@babel/plugin-proposal-decorators'),
										{
											"legacy": true
										}
									],
									[	
										resolvePackage('@babel/plugin-proposal-class-properties'),
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
						exclude,
						loader: resolvePackage('vue-loader'),
					},     
					{
						test: /\.(scss|css)$/,
						use: [
							resolvePackage('vue-style-loader'),
							resolvePackage('css-loader'),
							resolvePackage('sass-loader'),
							{
								loader: resolvePackage('sass-resources-loader'),
								options: {
									resources: [
										resolveClient("style/themes/var.scss"),
										resolvePackage("@wya/sass/lib/mixins/bem.scss")
									]
								}
							}
						]
					},
					{
						test: /\.(png|jpg|gif|eot|ttf|woff|woff2|svg)$/,
						loader: resolvePackage('url-loader')
					},
					{
						test: /\.md$/,
						use: [
							{ 
								loader: resolvePackage("html-loader"),
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
					template: resolveClient('static/index.tpl.html'),
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
					'@wya/vc': 'WYA_VC',
				}
		};

		return merge(defaultOptions, override, noOverrideConfig);
	}

	generateServer() {
		const { port, host } = this.$parent;
		const { docConfig = {}, sourceDir } = this.$parent.$parent;
		const { devServer = {} } = docConfig.webpackConfig || {};

		return merge(
			{
				hot: true,
				quiet: true,
				historyApiFallback: true,
				publicPath: '/',
				contentBase: resolve(sourceDir, "../"),
				port,
				host
			}, 
			devServer
		);
	}
	
}
module.exports = {
	get(type = 'webpack', parent) {
		return new Config(type, parent).result;
	}
};