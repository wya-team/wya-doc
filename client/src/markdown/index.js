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
		new Vue({
			render(h) {
				return h(Playground, {
					attrs: {
						source: code,
						id: it.id
					}
				});
			}
		}).$mount(`#${it.id}`);
	});
};