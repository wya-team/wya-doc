import Vc from '@wya/vc/lib/vc/index';
import { Storage } from '@wya/utils';
import { IndexedDB } from './utils';
import Playground from './components/playground';
import { LANG_TAG } from './constants';

class GlobalBase {
	constructor() {
		this.debug = __DEV__;

		// 版本号，由webpack注入
		this.version = __DOC_VERSION__;

		// 当前选择语言
		this.lang = (Storage.get(LANG_TAG) || {}).lang;

		this.db = new IndexedDB({
			name: 'wyadoc',
			version: __DOC_VERSION__
		});
	}
}

export const Global = new GlobalBase();

export default {
	install(Vue) {
		Vue.prototype.$global = Global;

		Vue.use(Vc);
		Vue.component(Playground.name, Playground);
	}
};

