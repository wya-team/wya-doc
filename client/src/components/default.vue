<template>
	<div :style="contentStyle" class="v-layout-content g-md-reset">
		<div v-md="content" />
	</div>
</template>

<script>
import { ajax } from '@wya/http';
import md from '../extends/md';

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
	data() {
		return {
			content: ''
		};
	},
	computed: {
		contentStyle() {
			return this.$parent.sidebar 
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
		this.$vc.on('locale-change', this.loadData);
		socket && socket.on('md-update', this.loadData);
	},
	beforeDestroy() {
		this.$vc.off('locale-change', this.loadData);
		socket && socket.off('md-update', this.loadData);
	},
	methods: {
		async loadData() {
			let { name: $name } = this.$route.params;
			let $locale = this.$route.path.split('/')[1];
			
			let { baseMDDir } 	= this.$global.docConfig;
			let url = typeof baseMDDir === 'string' 
				? `${location.origin}${baseMDDir}${$locale}/${$name}.md`
				: baseMDDir($locale, $name);

			let data;

			if (!__DEV__) {
				try {
					data = (await this.$global.db.read(url) || {}).data;
				} catch (e) {
					console.log(e);
				}
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
					// let id = location.hash.replace(/#/, '');
					// if (id && document.getElementById(id)) {
					// 	document.getElementById(id).scrollIntoView();
					// }
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
