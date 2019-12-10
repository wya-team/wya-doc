const { compileTemplate } = require('@vue/component-compiler-utils');
const vueTemplateCompiler = require('vue-template-compiler');

const stripByTag = (content, tag) => {
	const reg = new RegExp(`<(${tag})[\\s\\S]*>([\\s\\S]*)<\\/\\1>`);
	const result = content.match(reg);
	if (!result) return '';
	const insideContent = result[2];
	return result && insideContent ? insideContent.trim() : '';
};

exports.stripScript = content => stripByTag(content, 'script');

exports.stripStyle = content => stripByTag(content, 'style');


exports.stripTemplate = content => {
	content = content.trim();
	if (!content) return content;
	return content.replace(/<(script|style)[\s\S]*<\/\1>/g, '').trim();
};

exports.genComponent = (template, script) => {
	const compileOptions = {
		source: `<div>${template}</div>`,
		filename: 'inline-component',
		compiler: vueTemplateCompiler,
		preserveWhitespace: false
	};

	const compileResult = compileTemplate(compileOptions);

	// TODO: handle errors, tips
	if (compileResult.errors && compileResult.errors.length) {
		console.error(
			`\n  Error compiling template:\n${compileResult.source}\n`
			  + compileResult.errors.map(e => `  - ${e}`).join('\n')
			  + '\n'
		  );
	}

	if (compileResult.tips && compileResult.tips.length) {
		compileResult.tips.forEach(tip => {
			console.warn(
				`Warn compiling template: ${tip}\n`
			);
		});
	}

	let configText = '';
	script = script.trim();
	if (script) {
		configText = script.replace(/export\s+default/, 'const componentConfig =').replace(/\\n/g, ' ');
	} else {
		configText = 'const componentConfig = {}';
	}
	return `
		(function () {
			${compileResult.code}
			${configText}
			return {
				isFunctional: true,
				render,
				staticRenderFns,
				...componentConfig
			}
		})()
	`;
};
