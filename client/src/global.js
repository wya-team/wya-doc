import Vue from 'vue';
import Vc from '@wya/vc/lib/vc/index';
// import DemoBlock from './components/demo-block.vue';
// import VcAlert from './components/vc-alert.vue';

class GlobalBase {

	constructor() {
		this.version = '1.0';
	}

	init() {
		// Vue.component('demo-block', DemoBlock);
		// Vue.component('vc-alert', VcAlert);
		Vue.use(Vc);
	}

}

export const Global = new GlobalBase();

