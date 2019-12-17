<template>
	<div class="c-playground-editor">
		<c-playground-toolbar />
		<div :id="uid" />
	</div>
</template>

<script>
import CodeMirror from 'codemirror';
import 'codemirror/theme/material-palenight.css';
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
			code: '',
			uid: getUid()
		};
	},
	watch: {
		value(v) {
			this.code !== v && this.editor.setValue(v);
		}
	},
	mounted() {
		this.editor = CodeMirror(document.getElementById(this.uid), {
			mode: 'text/javascript',
			theme: 'material-palenight',
			tabSize: 4
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
.c-playground-editor {
	overflow: hidden;
}
</style>
