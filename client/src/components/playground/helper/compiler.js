import * as Babel from '@babel/standalone';
import '@babel/preset-env-standalone';
import TransformVueJsx from 'babel-plugin-transform-vue-jsx';
import str2ast from '@babel/template';
import * as types from '@babel/types';

import * as compiler from 'vue-template-compiler';
import stripWith from 'vue-template-es2015-compiler';

window.require = (url) => {
	// global dependence
	const globalDep = app.$global.dependence || window;

	if (globalDep[url]) {
		return globalDep[url];
	}
};
Babel.registerPlugin('transform-vue-jsx', TransformVueJsx);
Babel.registerPlugin('doc', (babel, opts = {}) => {
	const { render, staticRenderFns } = opts;
	return {
		visitor: {
			// css
			ImportDeclaration(path) {
				let { value } = path.node.source;
				if (/\.(scss|css)$/.test(value)) {
					path.remove();
				}
			},
			// portal【portal, 只能是wrapperComponent】
			VariableDeclarator(path) {
				if (
					!/wrapperComponent/.test(path.node.id.name) 
					|| !path.node.init.properties
				) return;
				render && path.node.init.properties.push(render);
				staticRenderFns && path.node.init.properties.push(staticRenderFns);
			},
			// export default
			ExportDefaultDeclaration(path) {
				if (!path.node.declaration.properties) return;
				render && path.node.declaration.properties.push(render);
				staticRenderFns && path.node.declaration.properties.push(staticRenderFns);
			}
		}
	};
});

export default class CompileCtor {
	constructor(options = {}) {
		this.options = options;
	}

	resetOptions() {
		this.options = options;
	}

	parse(code) {
		try {
			const { script, template, styles } = compiler.parseComponent(code);

			const { render, staticRenderFns } = this.parseTemplate(template);
			
			const value = this.parseScript(script, { render, staticRenderFns });
			const style = this.parseStyle((styles || []).map(i => i.content).join(`\n`) || '');

			code = `(function(){
				var module = {};
				module.exports = exports = {};
				${value};
				return module.exports.__esModule ? module.exports.default : exports;
			})()`;
			return {
				module: new Function(`return ${code}`)() || {}, // eslint-disable-line
				style
			};
		} catch (e) {
			throw new Error(e);
		}
	}

	parseTemplate(template) {
		let newRenderAst;
		let newStaticRenderAst;

		if (template && template.content) {
			// 1. template -> render
			const { render, staticRenderFns } = compiler.compile(template.content);

			try {
				// render
				let renderCode = stripWith(`function render(){${render}}`);
				let renderAst = str2ast(renderCode, {
					placeholderPattern: false, // 不使用占位符替换
				})();

				renderAst.type = 'FunctionExpression';
				newRenderAst = types.objectProperty(
					types.identifier('render'), 
					renderAst
				);

				// staticRenderCode
				let staticRenderCode = stripWith(`[${staticRenderFns.map(fn => `function (){${fn}}`).join(',')}]`);
				const staticRenderAst = str2ast(staticRenderCode, {
					placeholderPattern: false, // 不使用占位符替换
				})().expression;

				newStaticRenderAst = types.objectProperty(
					types.identifier('staticRenderFns'), 
					staticRenderAst
				);

			} catch (e) {
				throw new Error(e);
			}
		}

		return {
			render: newRenderAst,
			staticRenderFns: newStaticRenderAst
		};
	}

	parseScript(script = {}, opts) {
		let code;
		try {
			code = Babel.transform(script.content || 'export default {};', {
				presets: ["env"],
				plugins: [
					"proposal-export-namespace-from",
					"proposal-export-default-from",
					"proposal-function-bind",
					"syntax-dynamic-import",
					"syntax-jsx",
					"transform-vue-jsx",
					[
						"proposal-decorators",
						{
							"legacy": true
						}
					],
					[
						"proposal-class-properties",
						{
							"loose": true
						}
					],
					[
						'doc',
						opts
					]
				]
			}).code;
		} catch (e) {
			throw new Error(e);
		}
		return code;
	}

	/**
	 * TODO: 解析Sass
	 */
	parseStyle(code) {
		return code;
	}
}
export const Compiler = new CompileCtor();