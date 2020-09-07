import Vue from 'vue';
import Router from 'vue-router';

import routes from './.temp/routes';
import App from './app.vue';
import GLOBAL, { Global } from './global';

if (__DEV__) {
	!__DEP_VC__
		? require('@wya/vc/lib/vc.min.css')
		: require('@wya/vc/src/style/reset.scss');
}

// 使用import 会比上面提前引入
require('./style/index.scss');

export const createApp = async () => {
	const { baseSiteDir } = Global.docConfig || {};
	Vue.use(GLOBAL);
	Vue.use(Router);

	// TODO: routes可以考虑使用异步加载
	const router = new Router({
		mode: 'history',
		base: process.env.NODE_ENV === 'development'
			? '/'
			: baseSiteDir,
		routes
	});

	// - 实例
	const app = new Vue({
		el: "#pages",
		router,
		render(h) {
			return h(App);
		}
	});

	return {
		app,
		router
	};
};
