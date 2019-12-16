<template>
	<div :style="contentStyle" class="v-layout-content g-md-reset">
		<div v-md="content" />
	</div>
</template>

<script>
import { ajax } from '@wya/http';
import md from '../markdown';

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
	},
	beforeDestroy() {
		this.$vc.off('lang-change', this.loadData);
	},
	methods: {
		loadData() {
			let { name } = this.$route.params;
			const lang = this.$route.path.split('/')[1];
			ajax({
				url: location.origin + `${__DOC_MD_DIR__}${lang}/${name}.md`,
				debug: true,
				localData: null,
				onAfter: ({ response }) => {
					return {
						status: 1,
						data: response.data || '请刷新后再试试'
					};
				}
			}).then((res) => {
				this.content = res.data;
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
