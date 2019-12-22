import Vue from 'vue';
import md from './md';

export default (el, binding) => {
	const source = binding.value;
	let result = '';
	if (source) {
		result = md.render(source);
	}
	el.innerHTML = result;

	const palygrounds = document.querySelectorAll('div[data-code]');
	Array.prototype.forEach.call(palygrounds, it => {
		const code = it.dataset.code;
		new Vue({
			render(h) {
				return <c-playground source={ code }></c-playground>;
			}
		}).$mount(`#${it.id}`);
	});
	
};