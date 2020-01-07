import Vue from 'vue';
import Helper from './helper';
import Playground from '../components/playground/playground';

export default (el, binding) => {
	const source = binding.value;
	let result = '';
	if (source) {
		result = Helper.render(source);
	}
	
	el.innerHTML = result;

	const palygrounds = el.querySelectorAll('div[data-code]');
	[...palygrounds].forEach(it => {
		const code = it.dataset.code;
		const { $store: store, $router: router } = app || {};
		const Ctor = Vue.extend(Playground);
		return new Ctor({
			el: `#${it.id}`,
			store,
			router,
			propsData: {
				source: code,
				id: it.id
			}
		});
	});
};