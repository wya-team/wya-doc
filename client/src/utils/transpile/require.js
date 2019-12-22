import transform from './transform'; // eslint-disable-line 

const JS_MODULE_REG = /\.(js|jsx)$/;

const cache = {};

const load = (url) => {
	const xhr = new XMLHttpRequest();

	if (cache[url]) {
		return cache[url];
	}

	xhr.open('GET', url, false);
	xhr.send();
	const script = xhr.responseText;
	cache[url] = transform(script);
	return cache[url];
};

export default (url) => {
	// global dependence
	const globalDep = app.$global.dependence;

	if (globalDep[url]) {
		return globalDep[url];
	}

	if (JS_MODULE_REG.test(url)) {
		return load(url);
	}
};