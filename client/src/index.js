import Vue from 'vue';
import Router from 'vue-router';
import routes from './routes';
import App from './app.vue';
import GLOBAL from './global';

import '@style/index.scss';

Vue.use(GLOBAL);
Vue.use(Router);
const router = new Router({
	mode: 'history',
	// TODO: 由webpack配置所得
	base: process.env.NODE_ENV === 'development' 
		? '/' 
		: __DOC_BASE__,
	routes
});

// - 实例
const app = new Vue({
	el: "#pages",
	router,
	render(h) {
		return (
			<App />
		);
	}
});

// 先不考虑服务端渲染情况
router.onReady(() => {
	app.$mount();

	const { redirect } = sessionStorage;
	delete sessionStorage.redirect;

	// github pages hack
	const curUrl = `${location.pathname}${location.search}${location.hash}`;
	if (redirect && redirect.includes(__DOC_BASE__) && redirect != curUrl) {
		try {
			router.push(redirect.replace(__DOC_BASE__, '/'));
		} catch (e) {
			location.href = redirect;
		}
	}
});

window.app = app;
