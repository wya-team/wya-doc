const mdContainer = require('markdown-it-container');
const { SOURCE_START_MARK, SOURCE_END_MARK } = require('./constants');

module.exports = md => {
	md.use(mdContainer, 'demo', {
		validate(params) {
			return params.trim().match(/^demo\s*(.*)$/);
		},
		render(tokens, idx) {
			const token = tokens[idx];
			const nextToken = tokens[idx + 1];
			
			if (token.nesting === 1) {
				const descMatch = token.info.trim().match(/^demo\s*(.*)$/);
				const description = descMatch.length > 1 ? descMatch[1] : '';
				const content = nextToken.type === 'fence' ? nextToken.content : '';
				return `
					<demo-block>
						${description ? `<div class="description">${md.render(description)}</div>` : ''}
						${SOURCE_START_MARK}${content}${SOURCE_END_MARK}
				`;
			} else {
				return `</demo-block>`;
			}
		}
	});

	md.use(mdContainer, 'tip');
	md.use(mdContainer, 'warning');
};
