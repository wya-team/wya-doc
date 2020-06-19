const path = require('path');
const fs = require('fs-extra');
const nodeExternals = require('webpack-node-externals');
const VueLoaderPlugin = require('vue-loader/lib/plugin');
const ProgressBarPlugin = require('progress-bar-webpack-plugin');

const APP_ROOT = process.cwd();
const { resolve } = path;
const resolvePackage = (source) => {
	let nms = module.paths.map($path => resolve($path, source));
	let fullpath = nms.find(i => fs.pathExistsSync(i));

	if (!fullpath) {
		throw new Error(`@wya/doc: 未找到${source}`);
	}
	return fullpath;
};

const postcssLoader = {
	loader: resolvePackage('postcss-loader'),
	options: {
		config: {
			path: resolve(__dirname, '../postcss.config.js')
		}
	}
};

module.exports = {
	mode: 'development',
	resolve: { // 重定向路径
		mainFiles: ['index'],
		modules: [resolve(APP_ROOT, 'src'), 'node_modules'],
		extensions: ['.js', '.vue', '.json', '.scss', '.css'],
		alias: {
			'vue$': 'vue/dist/vue.esm.js',
			'node_modules': resolve(APP_ROOT, 'node_modules'),
			'@tests': resolve(APP_ROOT, 'tests')
		}
	},
	module: {
		rules: [
			{
				test: /\.jsx?$/,
				include: process.cwd(),
				exclude: /node_modules|tests\/helper.js|tests\/index.js/,
				use: [
					{
						loader: resolvePackage('babel-loader'),
						options: {
							cacheDirectory: true // 启用编译缓存
						}
					}
				]
			},
			{
				test: /\.vue/,
				include: process.cwd(),
				use: [
					{
						loader: resolvePackage('vue-loader'),
					}
				]
			},
			{
				test: /\.(css|scss)$/,
				use: [
					resolvePackage('vue-style-loader'), 
					resolvePackage('css-loader'), 
					postcssLoader, 
					resolvePackage('sass-loader')
				],
			},
			{
				test: /\.(png|jpg|gif|eot|ttf|woff|woff2|svg)$/,
				loader: resolvePackage('url-loader'),
				options: {
					limit: 10000
				}
			},
			{
				test: /\.html$/i,
				use: resolvePackage('html-loader')
			}
		]
	},
	externals: [],
	plugins: [
		new VueLoaderPlugin(),
		new ProgressBarPlugin()
	]
};