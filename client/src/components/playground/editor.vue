<template>
	<div class="c-playground-editor">
		<c-playground-toolbar />
		<div id="code" />
	</div>
</template>

<script>
import CodeMirror from 'codemirror';
import 'codemirror/theme/material-palenight.css';
import 'codemirror/lib/codemirror.css';

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
			editor: null
		};
	},
	mounted() {
		this.editor = CodeMirror(document.getElementById('code'), {
			mode: 'text/javascript',
			theme: 'material-palenight',
			tabSize: 4
		});
		this.editor.on('change', this.handleCodeChange);
	},
	beforeDestroy() {
		this.editor.off('change', this.handleCodeChange);
	},
	methods: {
		handleCodeChange(instance) {
			const content = this.editor.getValue();

			this.$emit('change', content);
		}
	},
};
</script>

<style lang="scss">

</style>
