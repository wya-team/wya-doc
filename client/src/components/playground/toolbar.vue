<template>
	<div class="c-playground-toolbar">
		<span
			v-for="(tool, index) in tools"
			:key="index"
			class="c-playground-toolbar__tool"
			@click="handleToolClick(tool.clickHandler)"
		>
			<vc-popover
				trigger="hover"
				placement="top"
				:content="tool.tipContent"
			>
				<vc-customer v-if="tool.content" :render="tool.content" />
				<vc-icon v-else :type="tool.icon" />
			</vc-popover>
		</span>
	</div>
</template>

<script>
import { Icon, Clipboard, Popover, Customer } from '@wya/vc';

export default {
	name: 'c-playground-toolbar',
	components: {
		'vc-popover': Popover,
		'vc-icon': Icon,
		'vc-customer': Customer,
		'vc-clipboard': Clipboard // eslint-disable-line
	},
	data() {
		return {
			isFullscreen: false
		};
	},
	computed: {
		tools() {
			const tools = [
				{
					content: (h) => {
						return (
							<vc-clipboard value={this.$parent.code}>copy</vc-clipboard>
						);
					},
					tipContent: '复制代码'
				}
			];
			if (document.fullscreenEnabled) {
				tools.push({
					icon: 'close',
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
		},
		handleToolClick(handler) {
			handler && handler();
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
	@include element(tool) {
		margin-right: 10px;
		cursor: pointer;
	}
}
</style>
