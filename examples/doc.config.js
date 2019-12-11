module.exports = {
	version: '1.0.0',
	routes: {
		'/index': {
			default: './components/index.vue',
			sidebar: null,
			header: null,
			footer: null,
			extra: null,
		},
		'/components/:name': {
			default: null,
			sidebar: {},
			header: './components/header.vue',
			footer: './components/footer.vue',
			extra: null,
		}
	},
	i18n: {
		'zh-CN': '简体中文',
		// 'en': 'English'
	},
	webpackConfig: {
		devServer: {}
	}
};