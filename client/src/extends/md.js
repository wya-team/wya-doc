import Vue from 'vue';
import hljs from 'highlight.js';

import { Markdown } from '../utils';
import Playground from '../components/playground';

/**
 * directive
 */
export default (el, binding) => {
	const source = binding.value;
	let result = '';
	if (source) {
		result = Markdown.render(source);
	}
	
	el.innerHTML = result;

	let palygrounds = el.querySelectorAll('div[data-code]');
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

	let blocks = el.querySelectorAll('pre code:not(.hljs)');
	[...blocks].forEach(hljs.highlightBlock);
};