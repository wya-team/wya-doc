import Config from 'markdown-it-chain';
import anchor from 'markdown-it-anchor';
import markdownIt from 'markdown-it';
import overWriteFence from './fence';
import container from './container';

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
		permalinkBefore: true
	}])
	.end()

	.plugin('container')
	.use(container)
	.end();

const md = config.toMd(markdownIt);

overWriteFence(md);

export default md;