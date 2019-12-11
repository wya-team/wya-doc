const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const merge = require('webpack-merge');
const VueLoaderPlugin = require('vue-loader/lib/plugin');
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin');

const { resolve } = path;

const ROOT_PATH = process.cwd();

const getWebpackConfig = (options) => { 
	return {
		mode: 'development',
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
			  '@nm': resolve(__dirname, '../node_modules'),
			},
			modules: [
				'node_modules',
				resolve(__dirname, 'wya-doc/node_modules')
			]
		},
		module: {
			rules: [
				{
					test: /\.js$/,
					exclude: /node_modules/,
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
								]
							]
						}
					}
				},
				{
					test: /\.vue$/,
					loader: 'vue-loader'
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
				}
			]
		},
		plugins: [
			new VueLoaderPlugin(),
			new HtmlWebpackPlugin({
				template: path.resolve(__dirname, '../client/index.tpl.html'),
				inject: 'body',
				filename: './index.html'
			}),
			new FriendlyErrorsPlugin({
				compilationSuccessInfo: {
					messages: ['success!!!']
				}
			})
		],
		externals: {
			'highlight.js': 'hljs'
		}
	};
};

const getServerConfig = (options) => {
	return {
		hot: true,
		quiet: true,
		historyApiFallback: true,
	};
};

// 不允许被覆盖的配置
const noOverrideConfig = {
	// 入口文件，是模块构建的起点
	entry: path.resolve(__dirname, '../client/src/index.js'),
};

class Config {
	static get(type = 'webpack', override, options = {}) {
		let defaultOptions = type === 'webpack' || type === true 
			? getWebpackConfig(options) 
			: getServerConfig(options);
		return merge(defaultOptions, override, type === 'webpack' ? noOverrideConfig : {});
	}
}
module.exports = Config;
