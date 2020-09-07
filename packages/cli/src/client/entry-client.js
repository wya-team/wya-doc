import { createApp } from './main';

(async () => {
	const { app, router } = await createApp();

	router.beforeEach((to, from, next) => {
		app.$vc.clear();
		next();
	});
	// 先不考虑服务端渲染情况
	router.onReady(() => {
		app.$mount();

		const { redirect } = sessionStorage;
		delete sessionStorage.redirect;

		// github pages hack
		const curUrl = `${location.pathname}${location.search}${location.hash}`;
		if (redirect && redirect.includes(baseSiteDir) && redirect != curUrl) {
			try {
				router.push(redirect.replace(baseSiteDir, '/'));
			} catch (e) {
				location.href = redirect;
			}
		}

		let lang = app.$route.path.split('/');
		if (app.$global.lang && app.$global.lang != lang[1]) {
			lang[1] = app.$global.lang;

			let url = `/${lang.slice(1).join('/')}${location.search}${location.hash}`;
			app.$router.replace(url);
		}
	});

	window.app = app;
})();


