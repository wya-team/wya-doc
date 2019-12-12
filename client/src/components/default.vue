<template>
	<div class="md-content">
		<div v-md="content" />
	</div>
</template>

<script>
import { ajax } from '@wya/http';
// TODO: 做一个资源解析sourcedir ../../../ -> @xxx
import mdTpl from '../../../examples/docs/zh-CN/alert.md';
import md from '../markdown';

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
	mounted() {
		ajax({
			url: location.origin + '/examples/zh-CN/alert.md',
			debug: true,
			localData: {
				status: 1,
				data: mdTpl
			}
		}).then((res) => {
			this.content = res.data;
		}).catch((e) => {
			console.log(e);
		});
	}
};
</script>

<style lang="scss">
@include block(md-content) {
	flex: 1;
}
</style>
