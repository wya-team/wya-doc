export const LOCALE_TAG = '@wya/doc/locale';

export const DEFAULT_HEADER = {
	name: '@wya/doc',
	logo: 'https://avatars3.githubusercontent.com/u/34465004?s=200&v=4',
	path: '/index',
	nav: [
		{
			name: '首页',
			path: '/index'
		},
		{
			name: '团队地址',
			path: 'https://github.com/wya-team',
			// _blank | _self 
			target: '_blank',
			// referrer
			rel: ''
		}
	]
};


export const DEFAULT_FOOTER = {
	copyright: 'Copyright © 2020 WeiYiAn Inc.',
	group: [
		{
			name: '资源',
			nav: [
				{
					logo: '',
					name: 'vue-env | 脚手架',
					path: 'https://github.com/wya-team/vue-env',
				},
				{
					logo: '',
					name: '@wya/toolkit | 指令库',
					path: 'https://github.com/wya-team/wya-toolkit',
				},
				{
					logo: '',
					name: '@wya/sass | 样式库',
					path: 'https://github.com/wya-team/wya-sass',
				},
				{
					logo: '',
					name: '@wya/qrcode | 二维码',
					path: 'https://github.com/wya-team/wya-qrcode',
				},
				{
					logo: '',
					name: '@wya/utils | 工具库',
					path: 'https://github.com/wya-team/wya-utils',
				},
				{
					logo: '',
					name: '@wya/http | 网络库',
					path: 'https://github.com/wya-team/wya-http',
				},
				{
					logo: '',
					name: '@wya/ps | 事件订阅、发布',
					path: 'https://github.com/wya-team/wya-ps',
				},
				{
					logo: '',
					name: '@wya/socket | WebSocket',
					path: 'https://github.com/wya-team/wya-socket',
				},
				{
					logo: '',
					name: '@wya/vc | 组件库',
					path: 'https://github.com/wya-team/wya-vc',
				},
				{
					logo: '',
					name: '@wya/vm | 拖拽/装修库',
					path: 'https://github.com/wya-team/wya-vm',
				},
				{
					logo: '',
					name: '@wya/js-sdk | Hybrid SDK',
					path: 'https://github.com/wya-team/wya-js-sdk',
				}
			]
		},
		{
			name: '社区',
			nav: [
				{
					name: '团队地址',
					path: 'https://github.com/wya-team',
					// _blank | _self 
					target: '_blank',
					// referrer
					rel: ''
				}
			]
		},
		{
			name: '反馈',
			nav: [
				{
					name: '反馈问题',
					path: 'https://github.com/wya-team',
					// _blank | _self 
					target: '_blank',
					// referrer
					rel: ''
				},
				{
					name: '提交需求',
					path: 'https://github.com/wya-team',
					// _blank | _self 
					target: '_blank',
					// referrer
					rel: ''
				},
				{
					name: 'Changelog',
					path: 'https://github.com/wya-team',
					// _blank | _self 
					target: '_blank',
					// referrer
					rel: ''
				}
			]
		},
		{
			name: '更多',
			nav: [
				{
					name: '团队博客',
					path: 'https://github.com/wya-team',
					// _blank | _self 
					target: '_blank',
					// referrer
					rel: ''
				}
			]
		}
	]
};