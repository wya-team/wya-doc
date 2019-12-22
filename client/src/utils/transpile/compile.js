import transform from './transform';
import { stripTemplate, stripScript, stripStyle } from './strip';

export default (code, scope) => {
	code = code.trim();
	const template = stripTemplate(code);
	let script = stripScript(code);
	const style = stripStyle(code);
	// console.log(template, '------------temp');
	// console.log(script, '--------scr');
	// console.log(style, '--------sty');

	script = transform(script);
	if (!template && !script && !style) {
		return {
			script
		};
	} else {
		return {
			template,
			script,
			style
		};
	}
};