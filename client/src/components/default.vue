<template>
	<div :style="contentStyle" class="v-layout-content g-md-reset">
		<div v-md="content" />
	</div>
</template>

<script>
import hljs from 'highlight.js';
import { ajax } from '@wya/http';
// import md from '../markdown';
import md from '../md';

import 'highlight.js/styles/github.css';

let socket;
if (__DEV__) {
	let { Socket } = require('@wya/socket');
	socket = new Socket();
	socket.connect(__DOC_SOCKET__);

	socket.on('open', () => {
		socket.send(JSON.stringify({
			type: 'open'
		}));
	});
}

export default {
	name: 'md-online',
	directives: {
		md
	},
	props: {
		layoutStatus: Object
	},
	data() {
		return {
			content: ''
		};
	},
	computed: {
		contentStyle() {
			return this.layoutStatus.sidebar 
				? {
					marginLeft: '300px', 
					paddingBottom: '60px',
					paddingRight: '130px'
				}
				: {};
		}
	},
	watch: {
		'$route.params.name': {
			immediate: true,
			handler(v, oldV) {
				this.loadData();
			}
		}
	},
	mounted() {
		this.$vc.on('lang-change', this.loadData);
		socket && socket.on('md-update', this.loadData);
	},
	beforeDestroy() {
		this.$vc.off('lang-change', this.loadData);
		socket && socket.off('md-update', this.loadData);
	},
	methods: {
		async loadData() {
			let { name } = this.$route.params;
			let lang = this.$route.path.split('/')[1];
			let url = location.origin + `${__DOC_MD_DIR__}${lang}/${name}.md`;
			let data;

			if (!__DEV__) {
				data = (await this.$global.db.read(url) || {}).data;
			}
			ajax({
				url,
				debug: true,
				localData: data,
				onAfter: ({ response }) => {
					return {
						status: 1,
						data: response.data || '请刷新后再试试'
					};
				}
			}).then((res) => {
				this.content = res.data;

				!__DEV__ && this.$global.db.update({
					__id: url,
					data: res,
				});
				
				this.$nextTick(() => {
					const blocks = this.$el.querySelectorAll('pre code:not(.hljs)');
					Array.prototype.forEach.call(blocks, hljs.highlightBlock);
				});
			}).catch((e) => {
				console.log(e);
			});
		}
	}

};
</script>

<style lang="scss">
@include block(md-content) {
	
}
</style>
