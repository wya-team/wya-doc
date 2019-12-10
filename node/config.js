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
			filename: 'bundle.js'
		},
		resolve: {
			extensions: ['.vue', '.js', '.json'],
			alias: {
			  'vue$': 'vue/dist/vue.esm.js',
			  '@': resolve(__dirname, '../client/src'),
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
					include: [/node_modules\\lit-html/], // https://github.com/jantimon/html-webpack-plugin/issues/1237
					loader: 'babel-loader'
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
						{
							loader: 'sass-loader',
							options: {
								// prependData: `@import '~@style/mixins/bem.scss';\n` // TODO：sass-loader@8.x应该是这种写法，但为什么不行？
								data: `@import '~@style/themes/var.scss';\n@import '@wya/sass/lib/mixins/bem.scss';\n`
							}
						}
					]
				},
				{
					test: /\.md/,
					use: [
						'vue-loader',
						{
							loader: resolve(__dirname, './md-loader/index.js')
						}
					]
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
		quiet: true
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
