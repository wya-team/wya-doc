import Vc from '@wya/vc/lib/vc/index';
import { Storage } from '@wya/utils';
// import DemoBlock from './components/demo-block.vue';
// import VcAlert from './components/vc-alert.vue';

class GlobalBase {
	constructor() {
		this.debug = __DEV__;
		
		// 版本号，由webpack注入
		this.version = __DOC_VERSION__;

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

