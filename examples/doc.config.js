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
		devServer: {}
	}
};