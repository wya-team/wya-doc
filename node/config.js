const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');
const merge = require('webpack-merge');
const VueLoaderPlugin = require('vue-loader/lib/plugin');
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin');

const { resolve } = path;
const r = (source) => resolve(__dirname, '../node_modules', source);
class Config {
	constructor(type, parent) {

		this.$parent = parent;

		this.result = type === 'webpack' || type === true 
			? this.generateDefault()
			: this.generateServer();
	}

	generateDefault() {
		let { port, host } = this.$parent;
		const { docConfig = {}, sourceDir, browserDir } = this.$parent.$parent;
		const { webpackConfig, runtime, locales, layout, externalResources, } = docConfig || {};
		const { __DOC_MD_DIR__: baseMDDir, __DOC_SITE_DIR__, __DOC_VERSION__ } = runtime.define || {};
		const { devServer, ...override } = webpackConfig || {};
		const ENV_IS_DEV = process.env.NODE_ENV === 'development';

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
					resolve(__dirname, '../node_modules')
				],
				extensions: ['.vue', '.js', '.json', '.md'],
				symlinks: true,
				alias: {
					'vue$': r('vue/dist/vue.esm.js'),
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
							loader: 'babel-loader',
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
							'vue-style-loader',
							'css-loader',
							'sass-loader',
							{
								loader: 'sass-resources-loader',
								options: {
									resources: [
										resolve(__dirname, "../client/src/style/themes/var.scss"),
										resolve(__dirname, "../node_modules/@wya/sass/lib/mixins/bem.scss")
									]
								}
							}
						]
					},
					{
						test: /\.(png|jpg|gif|eot|ttf|woff|woff2|svg)$/,
						loader: 'url-loader'
					},
					{
						test: /\.md$/,
						use: [
							{ 
								loader: "html-loader",
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
					template: resolve(__dirname, '../client/index.tpl.html'),
					inject: 'body',
					filename: './index.html',
				}),
				new FriendlyErrorsPlugin({
					compilationSuccessInfo: {
						messages: ['success!!!']
					}
				}),
				new webpack.DefinePlugin({
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
			externals: !ENV_IS_DEV 
				? {
					vue: 'Vue',
					lodash: '_',
					'@babel/standalone': 'Babel',
					'@babel/preset-env-standalone': 'BabelPresetEnv',
					'@wya/vc': 'WYA_VC',
				}
				: {}
		};

		// 不允许被覆盖的配置
		const noOverrideConfig = {
			// 入口文件，是模块构建的起点
			entry: [browserDir, resolve(__dirname, '../client/src/index.js')].filter(i => !!i),
		};

		return merge(defaultOptions, override, noOverrideConfig);
	}

	generateServer() {
		const { port, host } = this.$parent;
		const { docConfig = {} } = this.$parent.$parent;
		const { devServer = {} } = docConfig.webpackConfig || {};

		return merge({
			hot: true,
			quiet: true,
			historyApiFallback: true,
			publicPath: '/',
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
