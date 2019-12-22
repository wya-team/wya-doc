import Vc from '@wya/vc/lib/vc/index';
import { Storage } from '@wya/utils';
import { IndexedDB } from './utils';
import Playground from './components/playground';
import { LANG_TAG } from './constants';
import Alert from './components/vc-alert';

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

		// TODO: global dependence from doc.config
		this.dependence = {
			'@wya/utils': require('@wya/utils'),
			'@wya/vc': require('@wya/vc/lib/vc')
		};
	}
}

export const Global = new GlobalBase();

export default {
	install(Vue) {
		Vue.prototype.$global = Global;

		Vue.use(Vc);
		Vue.component(Playground.name, Playground);
		Vue.component(Alert.name, Alert);
	}
};

