const path = require('path');

const resolve = dir => path.resolve(__dirname, dir);

module.exports = [
	{
		path: '/',
		redirect: '/alert'
	},
	{
		path: '/home',
		name: 'home',
		components: {
			default: resolve('./components/home.vue'),
			header: true
		}
	},
	{
		path: '/alert',
		name: 'alert',
		// components: {
		// 	default: true,
		// 	// header: resolve('./components/header.vue'),
		// 	header: true,
		// 	side: true
		// }
	},
	{
		path: '*',
		redirect: '/alert'


	}
];