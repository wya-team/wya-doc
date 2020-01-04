<template>
	<vc-modal 
		v-model="isActive" 
		title="编辑" 
		draggable 
		:footer="false"
		:mask="false"
	>
		<textarea />
	</vc-modal>
</template>

<script>
import CodeMirror from 'codemirror';
import 'codemirror/mode/javascript/javascript.js';
import 'codemirror/addon/selection/active-line.js';
import 'codemirror/theme/material.css';
import 'codemirror/lib/codemirror.css';

import { Portal, Modal } from '@wya/vc';

const wrapperComponent = {
	name: 'c-playground-editor',
	components: {
		'vc-modal': Modal
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
			this.editor = CodeMirror.fromTextArea(this.$el.querySelector('textarea'), {
				mode: 'text/javascript',
				theme: 'material',
				styleActiveLine: true // 光标所在行高亮
			});
			this.editor.setValue(this.source);
			this.editor.focus();
			this.editor.on('change', this.handleChange);
		});
	},
	beforeDestroy() {
		this.editor.off('change', this.handleChange);
	},
	methods: {
		handleChange() {
			this.onChange(this.editor.getValue());
		}
	},
};

export default wrapperComponent;
export const Editor = new Portal(wrapperComponent, {
	promise: false
});
</script>

<style lang="scss">
@include block(c-playground-editor) {
	
}
</style>
