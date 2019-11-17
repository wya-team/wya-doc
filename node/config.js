const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const merge = require('webpack-merge');

const ROOT_PATH = process.cwd();
const getWebpackConfig = (options) => {
	return {
		mode: 'development',
		// 入口文件，是模块构建的起点
		entry: path.resolve(__dirname, '../client/src/index.js'),
		// 生成文件，是模块构建的终点
		output: {
			path: path.resolve(__dirname, '../dist'),
			filename: 'bundle.js'
		},
		module: {
			rules: [{
				test: /\.js$/,
				use: []
			}]
		},
		plugins: [
			new HtmlWebpackPlugin({
				template: path.resolve(__dirname, '../client/index.tpl.html'),
				inject: 'body',
				filename: './index.html'
			})
		]
	};
};

const getServerConfig = (options) => {
	return {
		hot: true
	};
};

class Config {
	static get = (type = 'webpack', override, options = {}) => {
		let defaultOptions = type === 'webpack' || type === true 
			? getWebpackConfig(options) 
			: getServerConfig(options);
		return merge(defaultOptions, override);
	}
}
module.exports = Config;
