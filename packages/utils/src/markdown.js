import Config from 'markdown-it-chain';
import anchor from 'markdown-it-anchor';
import mdContainer from 'markdown-it-container';
import markdownIt from 'markdown-it';

const HTML_MD_SIGN = 'md';
const RUNTIME = 'RUNTIME';
const TIP = 'TIP';
const WARNING = 'WARNING';
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
		const reg = new RegExp(`^${RUNTIME}\\s*(.*)$`);
		$md.use(mdContainer, RUNTIME, {
			validate(params) {
				return params.trim().match(reg);
			}
		});

		$md.use(mdContainer, TIP);
		$md.use(mdContainer, WARNING);
	})
	.end();


const md = config.toMd(markdownIt);

const renderAttrs = md.renderer.renderAttrs;
md.renderer.renderAttrs = (token) => {
	const reg = new RegExp(`container_${RUNTIME}|fence|text`);
	if (token.type && !reg.test(token.type)) {
		token.attrPush([HTML_MD_SIGN, '']);
	}
	
	return renderAttrs(token);
};

const defaultRender = md.renderer.rules.fence;
md.renderer.rules.fence = (tokens, index, ...rest) => {
	const prevToken = tokens[index - 1];

	// 如果前一个token是:::[RUNTIME]，则表明这个token是需要被识别为playground的
	const isHit = prevToken 
		&& prevToken.nesting === 1 
		&& prevToken.info.match(new RegExp(`^${RUNTIME}\\s*(.*)$`));

	return isHit
		? `<div id="PG-${index}" data-code="${md.utils.escapeHtml(tokens[index].content)}"></div>`
		: defaultRender(tokens, index, ...rest);
};

export default md;