const routes = require('./routes.config');

module.exports = {
	nav: {
		// side: './nav.config.json'
		side: require('./nav.config.js')
	},
	routes,
	i18n: {
		langMap: {
			'zh-CN': '简体中文',
			'en': 'English'
		},
		defaultLang: 'zh-CN'
	},
	webpackConfig: {
		devServer: {}
	}
};