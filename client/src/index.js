import Vue from 'vue';
import Router from 'vue-router';
import routes from './routes';
import App from './app.vue';
import { Global } from './global';

import 'highlight.js/styles/github.css';
import '@style/index.scss';

Global.init();
Vue.use(Router);
const router = new Router({
	mode: 'history',
	routes
});

router.afterEach(() => {
	Vue.nextTick(() => {
		const codeBlocks = document.querySelectorAll('pre code:not(.hljs)');
		Array.prototype.forEach.call(codeBlocks, hljs.highlightBlock);
	});
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
