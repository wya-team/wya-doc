const path = require('path');
const { inspect } = require('util');
const { cloneDeep } = require('lodash');

/**
 * 通过传入的routes配置爱生成routes
 */
exports.genRoutes = (routesConfig, docDir, i18nConfig = {}) => {
	const { langMap, defaultLang } = i18nConfig;
	const langs = langMap ? Object.keys(langMap) : null;
	const routes = [];
	const _addRoute = (lang) => {
		const realDocDir = lang ? path.resolve(docDir, `./${lang}`) : docDir;
		routesConfig.forEach(route => {
			const _route = cloneDeep(route);
			if (!_route.redirect) {
				if (_route.components) {
					Object.keys(_route.components).forEach(key => {
						if (typeof _route.components[key] === 'boolean' && _route.components[key]) {
							if (key === 'default') {
								_route.components = {
									..._route.components,
									default: path.resolve(realDocDir, `${_route.name}.md`)
								};
							} else {
								_route.components = {
									..._route.components,
									[key]: `@components/layout/${key}.vue`
								};
							}
						}
					});
				} else {
					_route.components = {
						default: path.resolve(realDocDir, `${_route.name}.md`),
						header: '@components/layout/header.vue',
						side: '@components/layout/side.vue'
					};
				}
			}
			if (lang) {
				const original = /^\/.*$/.test(_route.path) ? _route.path : `/${_route.path}`;
				_route.path = `/${lang}${original}`;
				_route.redirect && (_route.redirect = `/${lang}${_route.redirect}`);
			}
			let routeStr = inspect(_route);
			if (_route.components) {
				Object.keys(_route.components).forEach(it => {
					const reg = new RegExp(`('${_route.components[it]}')`);
					routeStr = routeStr.replace(reg, `() => import($1)`);
				});
			}
			routes.push(routeStr);
		});
	};

	if (langs) {
		langs.forEach(lang => {
			_addRoute(lang);
		});
		if (defaultLang) {
			routes.unshift(`{
				path: '/',
				redirect: '/${defaultLang}'
			}`);
		} else {
			throw new Error('i18n模式下请传入默认语言：defaultLang');
		}
	} else {
		_addRoute();
	}

	return `[${routes.join(',')}]`;
};