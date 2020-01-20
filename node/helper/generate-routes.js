const path = require('path');
const { normalize } = require('upath');
const { js: beautify } = require('js-beautify');

module.exports = ({ sourceDir, routes, locales }) => {
	let langs = Object.keys(locales) || [''];
	let content = ''; 
	// TODO: 文件是否存在
	const getPath = (mode, type, lang) => {
		if (typeof type === 'string') {
			return type === 'default' 
				? `require('${normalize(path.resolve(__dirname, `../../client/src/components/${mode}.vue`))}').default`
				: `require('${normalize(path.resolve(sourceDir, `./${lang}`, type))}').default`;
		} else if (typeof type === 'object' && type != null) {
			return `require('${normalize(path.resolve(__dirname, `../../client/src/components/${mode}.vue`))}').default`;
		}

		return null;
	};


	// TODO: code split / TODO: 优化
	langs.forEach((lang) => {
		Object.keys(routes).forEach((routePath) => {
			if (typeof routes[routePath] === 'string') {
				content += `{
					path: '${lang ? `/${lang}` : ''}${routePath}',
					redirect: '${lang ? `/${lang}` : ''}${routes[routePath]}'
				},`;
				return;
			} else if (typeof routes[routePath] === 'function') {
				content += `{
					path: '${routePath}',
					redirect: ${routes[routePath].toString()}
				},`;
				return;
			}
			const { default: _default, header, footer, sidebar, extra } = routes[routePath];
			content += `{
				path: '${lang ? `/${lang}` : ''}${routePath}',
				meta: {
					sidebar: ${JSON.stringify((sidebar && sidebar[lang]) || sidebar)}
				},
				components: {
					default: ${getPath('default', _default, lang)},
					header: ${getPath('header', header, lang)},
					footer: ${getPath('footer', footer, lang)},
					extra: ${getPath('extra', extra, lang)},
					sidebar: ${getPath('sidebar', sidebar, lang)},
				},
			},`;
		});
	});

	return `export default ${beautify(`[${content}]`, { 'indent-with-tabs': true })};`;
};