module.exports = {
	plugins: [
		// 比如想引入normalize.css 就需要这个了，遵循@import的 规则 @import 'normalize.css';
		// 还可以指定查找、引入的目录 比如 node_modules
		require('postcss-import'),
		// require('autoprefixer'), // 需指定browserslist，才能生效
		// require('postcss-flexbugs-fixes'),
		require('cssnano') // 对css进行压缩优化
	]
}