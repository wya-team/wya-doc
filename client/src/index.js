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
		: __DOC_SITE__,
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
	if (redirect && redirect.includes(__DOC_SITE__) && redirect != curUrl) {
		try {
			router.push(redirect.replace(__DOC_SITE__, '/'));
		} catch (e) {
			location.href = redirect;
		}
	}

	let lang = app.$route.path.split('/');
	if (app.$global.lang && app.$global.lang != lang[1]) {
		lang[1] = app.$global.lang; 

		let url = `${__DOC_SITE__}${lang.slice(1).join('/')}${location.search}${location.hash}`;
		app.$router.replace(url);
	}
});

window.app = app;
