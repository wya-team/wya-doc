<template>
	<div class="c-playground">
		<div :style="previewStyle" class="c-playground__preview">
			<c-playground-error v-show="error" :error="error" />
			<c-playground-preview
				v-show="!error"
				:source="code"
				:error.sync="error"
			/>
		</div>
		<div class="c-playground__resizer" />
		<c-playground-editor v-model="code" />
	</div>
</template>

<script>
import Editor from './editor';
import Preview from './preview';
import CError from './error';

export default {
	name: 'c-playground',
	components: {
		'c-playground-editor': Editor,
		'c-playground-preview': Preview,
		'c-playground-error': CError
	},
	props: {
		source: {
			type: String,
			default: ''
		}
	},
	data() {
		return {
			code: this.source,
			error: '',
			previewStyle: {
				// TODO: 拖拽调整宽度
				width: '300px'
			}
		};
	},
	methods: {
		
	},
};
</script>

<style lang="scss">
$block: c-playground;

@include block($block) {
	display: flex;
	width: 100%;
	border: 1px solid $c-border;
	border-radius: 4px;
	@include element(resizer) {
		margin: 0 -5px;
		width: 11px;
		border-left: 5px solid rgba(0, 0, 0, 0);
		border-right: 5px solid rgba(0, 0, 0, 0);
		background-color: #000;
		background-clip: padding-box;
		box-sizing: border-box;
		opacity: .1;
		z-index: 1;
		cursor: col-resize;
		&:hover {
			border-left: 5px solid rgba(0, 0, 0, .5);
			border-right: 5px solid rgba(0, 0, 0, .5);
		}
	}
	@include element(preview) {
		flex-shrink: 0;
	}
	.c-playground-editor {
		flex: 1;
	}
}
@media screen and (max-width: 1024px) {
	@include block($block) {
		flex-direction: column;
		@include element(resizer) {
			display: none;
		}
	}
}
</style>
