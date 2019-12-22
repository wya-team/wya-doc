import { PG_MARK } from './constants';

export default md => {
	const defaultRender = md.renderer.rules.fence;

	md.renderer.rules.fence = (tokens, idx, ...rest) => {
		const prevToken = tokens[idx - 1];
		// 如果前一个token是:::[PG_MARK]，则表明这个token是需要被识别为playground的
		const isHit = prevToken 
						&& prevToken.nesting === 1 
						&& prevToken.info.match(new RegExp(`^${PG_MARK}\\s*(.*)$`));
		
		return isHit
			? `<div id="PG-${idx}" data-code="${md.utils.escapeHtml(tokens[idx].content)}"></div>`
			: defaultRender(tokens, idx, ...rest);
	};
};