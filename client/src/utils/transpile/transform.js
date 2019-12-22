import '@babel/standalone';
import TransformVueJsx from 'babel-plugin-transform-vue-jsx';
import require from './require'; // eslint-disable-line

// https://babeljs.io/docs/en/babel-standalone

window.require = require;

export default (script, scope = {}) => {
	if (typeof window.Babel !== 'undefined') {
		const plugins = [];

		if (!Babel.availablePlugins['transform-vue-jsx']) {
			Babel.registerPlugin('transform-vue-jsx', TransformVueJsx);
		}
		plugins.push('transform-vue-jsx');

		let code = Babel.transform(script, {
			presets: [['es2015', { loose: true }], 'stage-3'],
			plugins,
			comments: false
		}).code;
		
		let scopeDecl = '';
		for (let variable in scope) {
			if (scope.hasOwnProperty(variable)) { // eslint-disable-line
				scopeDecl += `var ${variable} = __scope['${variable}']`;
			}
		}

		code = `(function(){
			var module={};
			module.exports=exports={};
			${scopeDecl};
			${code};
			return module.exports.__esModule?module.exports.default:exports;
		})()`;

		return new Function('__scope', `return ${code}`)(scope) || {}; // eslint-disable-line
	}
};