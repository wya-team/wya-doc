<template>
	<div class="c-playground-editor">
		<vc-transition-fade @after-leave="hide">
			<div v-show="isActive" ref="wrapper" class="c-playground-editor__wrapper">
				<div ref="bar" class="c-playground-editor__header">
					<span>&lt;/&gt;</span>
					<span style="cursor: pointer;" @click="hide">&#10005;</span>
				</div>
				<div class="c-playground-editor__editor">
					<textarea ref="textarea" />
				</div>
			</div>
		</vc-transition-fade>
	</div>
</template>

<script>
import CodeMirror from 'codemirror';
import 'codemirror/mode/javascript/javascript.js';
import 'codemirror/addon/selection/active-line.js';
import 'codemirror/theme/material.css';
import 'codemirror/lib/codemirror.css';
import { Portal, Transition } from '@wya/vc';
import { Drag } from '../../utils';

const wrapperComponent = {
	name: 'c-playground-editor',
	components: {
		'vc-transition-fade': Transition.Fade
	},
	props: {
		source: {
			type: String,
			default: ''
		},
		onChange: {
			type: Function,
			default: () => (() => {})
		}
	},
	data() {
		return {
			isActive: false,
		};
	},
	created() {
		this.editor = null;
	},
	mounted() {
		this.isActive = true;
		this.$nextTick(() => { 
			this.editor = CodeMirror.fromTextArea(this.$refs.textarea, {
				mode: 'text/javascript',
				theme: 'material',
				styleActiveLine: true // 光标所在行高亮
			});
			this.editor.setValue(this.source);
			this.editor.focus();
			this.editor.on('change', this.handleChange);

			this.drag = new Drag({
				el: this.$refs.bar,
				wrapper: this.$refs.wrapper,
				container: window
			});
		});
	},
	beforeDestroy() {
		this.editor.off('change', this.handleChange);
		this.drag.off();
	},
	methods: {
		update() {
			this.editor.setValue(this.source);
		},
		hide() {
			this.isActive = false;
			this.$emit('close');
		},
		handleChange() {
			this.onChange(this.editor.getValue());
		}
	},
};

export default wrapperComponent;
export const Editor = new Portal(wrapperComponent, {
	promise: false,
	alive: true,
	aliveRegExp: { className: /(PORTAL_TAG_DISABLE)/ },
});
</script>

<style lang="scss">
@include block(c-playground-editor) {
	@include element(wrapper) {
		width: 600px;
		position: fixed;
		right: 10px;
		bottom: 10px;
		font-size: 13px;
		border-radius: 3px;
		box-shadow: 0 0 50px rgba(#000, 0.2);
		opacity: 1;
		background: white;
		z-index: 99999;
	}
	@include element(header) {
		display: flex;
		justify-content: space-between;
		align-items: center;
		background: #f6f8fa !important;
		padding: 10px;
		font-size: 20px;
		line-height: 20px;
		cursor: move;
	}

	@include element(editor) {
		padding: 1px;
		background: #f6f8fa !important;
	}
}

</style>
