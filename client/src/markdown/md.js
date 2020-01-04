import Config from 'markdown-it-chain';
import anchor from 'markdown-it-anchor';
import mdContainer from 'markdown-it-container';
import markdownIt from 'markdown-it';

const PG_MARK = 'demo';
const config = new Config();

config
	.options
	.html(true)
	.typographer(true)
	.linkify(true)
	.end()

	.plugin('anchor')
	.use(anchor, [{
		permalink: true,
		permalinkBefore: true,
		permalinkSymbol: '#'
	}])
	.end()

	.plugin('container')
	.use($md => {
		const reg = new RegExp(`^${PG_MARK}\\s*(.*)$`);
		$md.use(mdContainer, PG_MARK, {
			validate(params) {
				return params.trim().match(reg);
			}
		});
	})
	.end();

const md = config.toMd(markdownIt);
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

export default md;