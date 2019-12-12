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
});

window.lang = 'zh-CN';
window.app = app;
