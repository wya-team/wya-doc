import Vue from 'vue';
import Router from 'vue-router';
import { Vc } from '@nm/@wya/vc';
import routes from './routes';
import App from './app.vue';
import DemoBlock from './components/demo-block.vue';
import VcAlert from './components/vc-alert.vue';

import 'highlight.js/styles/github.css';
import '@style/index.scss';

Vue.use(Vc);
Vue.use(Router);

Vue.component('demo-block', DemoBlock);
Vue.component('vc-alert', VcAlert);

const router = new Router({
	mode: 'hash',
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
	components: { App },
	template: '<app/>'
}).$mount();

// 先不考虑服务端渲染情况
router.onReady(() => {
	app.$mount();
});

window.lang = 'zh-CN';
window.app = app;
