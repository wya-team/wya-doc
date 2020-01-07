import * as WYA_VC from '@wya/vc';
import * as Utils from '@wya/utils';
import { IndexedDB } from './utils';
import { LOCALE_TAG } from './constants';

class GlobalBase {
	constructor() {
		this.debug = __DEV__;

		// 版本号，由webpack注入
		this.version = __DOC_VERSION__;

		// 当前选择语言
		this.lang = (Utils.Storage.get(LOCALE_TAG) || {}).lang;

		this.db = new IndexedDB({
			name: 'wyadoc',
			version: __DOC_VERSION__
		});

		this.docConfig = {
			...(window.$docConfig || {}),
			version: __DOC_VERSION__,
			locales: __DOC_LOCALES__,
			layout: __DOC_LAYOUT__,
			baseSiteDir: __DOC_SITE_DIR__,
			baseMDDir: __DOC_MD_DIR__ || ((locale, name) => `${location.origin}/docs/${locale}/${name}.md`),
		};

		this.dependence = {
			'@wya/utils': Utils,
			'@wya/vc': WYA_VC,
		};
	}
}

export const Global = new GlobalBase();

export default {
	install(Vue) {
		Vue.prototype.$global = Global;

		Vue.use(WYA_VC);

		Vue.filter('i18n', (value, locale) => {
			if (!value) return '';
			return typeof value === 'object' 
				? value[locale]
				: value;
		});
	}
};

