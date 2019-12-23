const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');
const merge = require('webpack-merge');
const VueLoaderPlugin = require('vue-loader/lib/plugin');
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin');

const { resolve } = path;

const ROOT_PATH = process.cwd();

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
		const { webpackConfig, runtime } = docConfig || {};
		const { devServer, ...override } = webpackConfig || {};
		const ENV_IS_DEV = process.env.NODE_ENV === 'development';

		const loaderPath = [
			path.resolve(__dirname, '../node_modules', "./@xls/public"),
			path.resolve(__dirname, '../node_modules', "./@wya/vc"),
			path.resolve(__dirname, '../node_modules', "./@wya/vm"),
			path.resolve(__dirname, '../node_modules', "./iview"),
			path.resolve(__dirname, '../client'),
			sourceDir
		];

		const defaultOptions = {
			mode: process.env.NODE_ENV,
			devtool: ENV_IS_DEV ? 'cheap-module-eval-source-map' : undefined,
			// 生成文件，是模块构建的终点
			output: {
				path: path.resolve(__dirname, '../dist'),
				filename: `js/[name].bundle.js`, // 每个页面对应的主js的生成配置
				chunkFilename: `js/[name].chunk.js`, // chunk生成的配置
				sourceMapFilename: `js/[name].bundle.map`,
				publicPath: '/',
			},
			resolve: {
				extensions: ['.vue', '.js', '.json'],
				alias: {
				  'vue$': 'vue/dist/vue.esm.js',
				  '@assets': resolve(__dirname, '../client/src/assets'),
				  '@style': resolve(__dirname, '../client/src/style'),
				  '@components': resolve(__dirname, '../client/src/components'),
				  '@utils': resolve(__dirname, '../client/src/utils'),
				}
			},
			module: {
				rules: [
					{
						test: /\.js$/,
						include: loaderPath,
						use: {
							loader: 'babel-loader',
							options: {
								compact: false,
								cacheDirectory: true,
								presets: [
									"@babel/preset-env"
								],
								plugins: [
									"@babel/plugin-proposal-export-namespace-from",
									"@babel/plugin-proposal-export-default-from",
									"@babel/plugin-proposal-function-bind",
									"@babel/plugin-syntax-dynamic-import",
									"@babel/plugin-syntax-jsx",
									"transform-vue-jsx",
									[
										"@babel/plugin-proposal-decorators",
										{
											"legacy": true
										}
									],
									[
										"@babel/plugin-proposal-class-properties",
										{
											"loose": true
										}
									],
									[
										"import",
										{
											"libraryName": "@wya/vc",
											"libraryDirectory": "lib",
											"customName": (name) => {
												if (/^m-/.test(name)) {
													return `@wya/vc/lib/${name.replace(/^m-/, '')}/index.m`;
												}
												return `@wya/vc/lib/${name}`;
											}
										},
										"@wya/vc"
									]
								]
							}
						}
					},
					{
						test: /\.vue$/,
						loader: 'vue-loader',
						include: loaderPath
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
										path.resolve(__dirname, "../client/src/style/themes/var.scss"),
										path.resolve(__dirname, "../node_modules/@wya/sass/lib/mixins/bem.scss")
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
					template: path.resolve(__dirname, '../client/index.tpl.html'),
					inject: 'body',
					filename: './index.html'
				}),
				new FriendlyErrorsPlugin({
					compilationSuccessInfo: {
						messages: ['success!!!']
					}
				}),
				new webpack.DefinePlugin({
					__DEV__: JSON.stringify(ENV_IS_DEV),
					__DOC_SOCKET__: `'ws://${host}:${++port}'`,
					__DOC_SITE__: "'/'",
					__DOC_VERSION__: "'1.0.0'",
					...runtime.define
				})
			],
			externals: !ENV_IS_DEV 
				? {
					vue: 'Vue',
					lodash: '_',
					marked: 'marked'
				}
				: {}
		};
		// 不允许被覆盖的配置
		const noOverrideConfig = {
			// 入口文件，是模块构建的起点
			entry: [browserDir, path.resolve(__dirname, '../client/src/index.js')].filter(i => !!i),
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
