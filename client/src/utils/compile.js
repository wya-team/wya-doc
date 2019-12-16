import transform from './transform';

const vueTemplateCompiler = require('vue-template-compiler');
// const compileTemplate = require('@vue/component-compiler-utils');
const Babel = require('@babel/core');

export default (script, scope) => {
	// console.log(compileTemplate);
	script = script.trim();
	return script ? transform(script, scope) : {};
	// return script ? vueTemplateCompiler.compile(script) : '';

};