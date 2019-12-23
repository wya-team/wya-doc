<template>
	<div class="c-playground-editor">
		<c-playground-toolbar 
			:code="code"
			@fullscreen-toggle="$emit('fullscreen-toggle', arguments[0])"
		/>

		<textarea :id="uid" />
	</div>
</template>

<script>
import CodeMirror from 'codemirror';
import 'codemirror/mode/javascript/javascript.js';
import 'codemirror/addon/selection/active-line.js';
import 'codemirror/theme/material.css';
import 'codemirror/lib/codemirror.css';

import { getUid } from '@utils/index';
import Toolbar from './toolbar';

export default {
	name: 'c-playground-editor',
	components: {
		'c-playground-toolbar': Toolbar
	},
	model: {
		prop: 'value',
		event: 'change'
	},
	props: {
		value: {
			type: String,
			default: ''
		}
	},
	data() {
		return {
			editor: null,
			code: this.value,
			uid: getUid()
		};
	},
	watch: {
		value(v) {
			this.code !== v && this.editor.setValue(v);
		}
	},
	mounted() {
		this.editor = CodeMirror.fromTextArea(document.getElementById(this.uid), {
			mode: 'text/javascript',
			theme: 'material',
			styleActiveLine: true // 光标所在行高亮
		});
		this.editor.setValue(this.value);
		this.editor.on('change', this.handleCodeChange);
	},
	beforeDestroy() {
		this.editor.off('change', this.handleCodeChange);
	},
	methods: {
		handleCodeChange(instance) {
			this.code = this.editor.getValue();
			this.$emit('change', this.code);
		}
	},
};
</script>

<style lang="scss">
@include block(c-playground-editor) {
	overflow: hidden;
	display: flex;
	flex-direction: column;
	.CodeMirror {
		flex-grow: 1;
	}
}
</style>
