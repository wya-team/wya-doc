const fs = require('fs');
const md = require('./md');
const { stripScript, stripTemplate, stripStyle, genComponent } = require('./utils');
const { SOURCE_START_MARK, SOURCE_END_MARK } = require('./constants');

module.exports = source => {
	const result = md.render(source);

	let output = [];

	const startMarkLength = SOURCE_START_MARK.length;
	const endMarkLength = SOURCE_END_MARK.length;

	let componentString = '';
	let id = 1;
	let start = 0;

	let startIndex = result.indexOf(SOURCE_START_MARK);
	let endIndex = result.indexOf(SOURCE_END_MARK, startIndex + startMarkLength);
	while (startIndex !== -1 && endIndex !== -1) {
		output.push(result.slice(start, startIndex));

		const sourceCode = result.slice(startIndex + startMarkLength, endIndex);
		const html = stripTemplate(sourceCode);
		const script = stripScript(sourceCode);
		// const style = stripStyle(sourceCode);

		const demoComponentContent = genComponent(html, script);
		const demoComponentName = `wya-demo-${id}`;
		output.push(`<template #source><${demoComponentName} /></template>`);
		componentString += `'${demoComponentName}': ${demoComponentContent},`;

		id++;
		start = endIndex + endMarkLength;
		startIndex = result.indexOf(SOURCE_START_MARK, start);
		endIndex = result.indexOf(SOURCE_END_MARK, start + startMarkLength);
	}

	let pageScript = '';
	if (componentString) {
		pageScript = `
			<script>
				export default {
					name: 'wya-doc-demo',
					components: {
						${componentString}
					}
				}
			</script>
		`;
	} else if (result.indexOf('<script>') === 0) { // 类似组件的写法，在md中写script标签，但目前需要将script标签放在最开始位置进行标识（可以优化）
		start = result.indexOf('</script>') + '</script>'.length;
		pageScript = result.slice(0, start);
	}

	output.push(result.slice(start));
	
	return `<template>
		<div class="wya-doc-demo">
			${output.join('')}
		</div>
	</template>
	${pageScript}
	`;
};