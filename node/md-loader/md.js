const Config = require('markdown-it-chain');
const anchor = require('markdown-it-anchor');
const containers = require('./containers');
const overWriteFence = require('./fence');

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

	.plugin('containers')
	.use(containers)
	.end();

const md = config.toMd();

overWriteFence(md);

module.exports = md;