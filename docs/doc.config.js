const path = require('path');
const sidebar = require('./nav.config.js');

module.exports = {
	version: '1.0.0',
	/**
	 * null | './xxx/xxx.vue' | 'default' | json;
	 */
	routes: {
		'/': '/index',
		'/index': {
			default: './components/index.vue',
			sidebar: null,
			header: 'default',
			footer: 'default',
			extra: null,
		},
		'/components/:name': {
			default: 'default',
			sidebar,
			header: 'default',
			footer: 'default',
			extra: null,
		},
		'/api/:name': {
			default: 'default',
			sidebar,
			header: './components/header.vue',
			footer: './components/footer.vue',
			extra: null,
		},
		'*': (to) => {
			return '/zh-CN/index';
		}
	},
	i18n: {
		'zh-CN': '简体中文',
		'en-US': 'English'
	},
	webpackConfig: {
		output: {
			path: path.resolve(__dirname, '../site/'),
			publicPath: process.env.NODE_ENV === 'development'
				? '/'
				: '/wya-doc/site/'
		},
		devServer: {},
	},

	runtime: { 
		define: {
			__DOC_BASE__: `'${process.env.NODE_ENV === 'development' ? '/' : '/wya-doc/site/'}'`,
			__DOC_VERSION__: "'1.0.0'",
		}
	}
};