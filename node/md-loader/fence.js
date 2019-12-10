module.exports = md => {
	const defaultRender = md.renderer.rules.fence;

	md.renderer.rules.fence = (tokens, idx) => {
		const prevToken = tokens[idx - 1];

		const isHit = prevToken && prevToken.nesting === 1 && prevToken.info.match(/^demo\s*(.*)$/);
		if (isHit) {
			return `
				<template #highlight>
					<pre>
						<code class="html">${md.utils.escapeHtml(tokens[idx].content)}</code>
					</pre>
				</template>
			`;
		} else {
			return defaultRender(arguments);
		}
	};
};