<template>
	<div class="c-playground">
		<div class="c-playground__header">
			<div />
			<div class="c-playground__tools">
				<span @click="handleEditor">&lt;/&gt;</span>
			</div>
		</div>
		<div v-if="error" class="c-playground__error">
			{{ error }}
		</div>
		<section v-else ref="preview" class="c-playground__preview" />
	</div>
</template>

<script>
import Vue from 'vue';
import { Editor } from './editor';
import transpile from './utils/index';

export default {
	name: 'c-playground',
	props: {
		source: {
			type: String,
			default: ''
		}
	},
	data() {
		return {
			code: '',
			error: ''
		};
	},
	watch: {
		source: {
			immediate: true,
			handler(v) {
				this.code = v;
				this.renderCode();
			}
		}
	},
	mounted() {
		this.renderCode();
	},
	methods: {
		renderCode() {
			const el = this.$refs.preview;

			if (!el) return;
			try {
				if (this.codeVM) {
					this.codeVM.$destroy();
					this.codeVM.$el && el.removeChild(this.codeVM.$el);
					this.codeVM = null;
				}

				const { template, script, style } = transpile(this.code);

				const div = document.createElement('div');
				el.appendChild(div);

				if (style) {
					let styleEl = el.querySelector('style[data-playground]');
					if (!styleEl) {
						styleEl = document.createElement('style');
						styleEl.type = 'text/css';
						styleEl.dataset.playground = true;
					}
					styleEl.innerHTML = style;
					el.appendChild(styleEl);
				}

				this.codeVM = new Vue({ 
					template,
					...script
				}).$mount(div);

				this.error = '';
			} catch (error) {
				this.error = error;
			}
		},
		handleEditor() {
			Editor.popup({
				source: this.source,
				onChange: (code) => {
					this.code = code;
					this.renderCode(code);
				}
			});
		}
	},
};
</script>

<style lang="scss">
$block: c-playground;

@include block($block) {
	width: 100%;
	display: flex;
	// align-items: center;
	justify-content: center;
	flex-direction: column;

	box-shadow: rgb(229, 229, 229) 0px 0px 10px;
	
	@include element(header) {
		display: flex;
		justify-content: space-between;
		align-items: center;
		background: #f6f8fa !important;
		padding: 10px;
		
		@include element(tools) {
			display: flex;
			align-items: center;
			font-size: 20px;
			line-height: 20px;
			> span {
				cursor: pointer;
			}
		}
	}
	@include element(error) {
		display: flex;
		justify-content: center;
		align-items: center;
		height: 100%;
	}
	@include element(preview) {
		padding: 10px;
		margin-top: 10px;
	}
}
</style>
