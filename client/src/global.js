import Vc from '@wya/vc/lib/vc/index';
import { Storage } from '@wya/utils';
// import DemoBlock from './components/demo-block.vue';
// import VcAlert from './components/vc-alert.vue';

class GlobalBase {
	constructor() {

		// 版本号，由webpack注入
		this.version = '__VERSION__';

		// 当前选择语言
		this.locale = Storage.get('@wya/doc/locale') 
			|| document.querySelector('html').lang
			|| 'zh-CN';
	}
}

export const Global = new GlobalBase();

export default {
	install(Vue) {
		Vue.prototype.$global = Global;

		// Vue.component('demo-block', DemoBlock);
		// Vue.component('vc-alert', VcAlert);
		Vue.use(Vc);
	}
};

