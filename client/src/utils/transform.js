export default (script, scope) => {
	script = script.replace(/export\s+default/, 'return');
	return new Function('script', script)(script); // eslint-disable-line
};