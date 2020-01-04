import Vue from 'vue';
import md from './md';
import Playground from '../components/playground';

export default (el, binding) => {
	const source = binding.value;
	let result = '';
	if (source) {
		result = md.render(source);
	}
	
	el.innerHTML = result;

	const palygrounds = el.querySelectorAll('div[data-code]');
	[...palygrounds].forEach(it => {
		const code = it.dataset.code;
		new Vue({
			render(h) {
				return <Playground source={code} />;
			}
		}).$mount(`#${it.id}`);
	});
};