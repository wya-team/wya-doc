<template>
	<section class="c-playground-preview" />
</template>

<script>
import Vue from 'vue';
import { compile, stripTemplate, stripScript, stripStyle } from '@utils/index';

export default {
	name: 'c-playground-preview',
	props: {
		source: {
			type: String,
			default: ''
		},
		error: {
			type: String,
			default: ''
		}
	},
	data() {
		return {
			codeVM: null
		};
	},
	watch: {
		source() {
			this.renderCode();
		}
	},
	mounted() {
		this.renderCode();
	},
	methods: {
		renderCode() {
			const parent = this.$el;
			try {
				if (this.codeVM) {
					this.codeVM.$destroy();
					this.codeVM.$el && parent.removeChild(this.codeVM.$el);
					this.codeVM = null;
				}
				const template = stripTemplate(this.source);
				const script = stripScript(this.source);
				const style = stripStyle(this.source);
				const result = compile(script, this.$global);
				// const { render, staticRenderFns } = compile(template);
				const el = document.createElement('div');
				parent.appendChild(el);
				this.codeVM = new Vue({ 
					// render,
					// staticRenderFns,
					template,
					...result
				}).$mount(el);
				this.$emit('update:error', '');
			} catch (error) {
				this.$emit('update:error', error);
			}
		}
	}
};
</script>

<style lang="scss">

</style>
