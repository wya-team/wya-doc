import bar from './bar';

bar();

// 热替换选项
if (module.hot) {
	module.hot.accept('./bar', () => {
		const _bar = require('./bar').default;
		_bar();
	});
}