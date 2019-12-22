<template>
	<div class="c-playground-toolbar">
		<span
			v-for="(tool, index) in tools"
			:key="index"
			@click="tool.clickHandler"
		>
			<!-- <vc-popover
				trigger="hover"
				placement="top"
				:content="tool.tipContent"
			>
				<vc-icon :type="tool.icon" />
			</vc-popover> -->
			<!-- <vc-icon :type="tool.icon" /> -->
			{{ tool.tipContent }}
		</span>
	</div>
</template>

<script>
// import { Icon } from '@wya/vc';

export default {
	name: 'c-playground-toolbar',
	components: {
		// 'vc-popover': Popover
		// 'vc-icon': Icon
	},
	data() {
		return {
			isFullscreen: false
		};
	},
	computed: {
		tools() {
			const tools = [];
			if (document.fullscreenEnabled) {
				tools.push({
					icon: '',
					tipContent: this.isFullscreen ? '退出全屏' : '全屏',
					clickHandler: this.handleFullscreen
				});
			}
			return tools;
		}
	},
	methods: {
		handleFullscreen() {
			this.isFullscreen = !!document.fullscreenElement;
			this.isFullscreen = !this.isFullscreen;
			this.$emit('fullscreen-toggle', this.isFullscreen);
		}
	},
};
</script>

<style lang="scss">
@include block(c-playground-toolbar) {
	padding: 0 16px;
	display: flex;
	justify-content: flex-end;
	align-items: center;
	height: 36px;
	background-color: $cf9;
}
</style>
