import Vue from 'vue';
import Router from 'vue-router';
import routes from './routes';
import App from './app.vue';
import GLOBAL from './global';

if (__DEV__) {
	require('@wya/vc/lib/vc.min.css');
}

// 使用import 会比上面提前引入
require('@style/index.scss');

const { baseSiteDir } = GLOBAL.docConfig || {};
Vue.use(GLOBAL);
Vue.use(Router);
const router = new Router({
	mode: 'history',
	// TODO: 由webpack配置所得
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
	if (redirect && redirect.includes(baseSiteDir) && redirect != curUrl) {
		try {
			router.push(redirect.replace(baseSiteDir, '/'));
		} catch (e) {
			location.href = redirect;
		}
	}

	let lang = app.$route.path.split('/');
	if (app.$global.lang && app.$global.lang != lang[1]) {
		lang[1] = app.$global.lang; 

		let url = `${baseSiteDir}${lang.slice(1).join('/')}${location.search}${location.hash}`;
		app.$router.replace(url);
	}
});

window.app = app;
