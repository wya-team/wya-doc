<template>
	<div class="c-playground">
		<div class="c-playground__header">
			<div />
			<div class="c-playground__tools">
				<vc-clipboard :value="code" tag="span">{{ copyText | i18n(currentLocale) }}</vc-clipboard>
				<span @click="handleEditor">&lt;/&gt;</span>
			</div>
		</div>
		<div v-if="error" class="c-playground__error">
			{{ error }}
		</div>
		<section v-show="!error" ref="preview" class="c-playground__preview" />
	</div>
</template>

<script>
import Vue from 'vue';
import { Load } from '@wya/utils';
import { Clipboard } from '@wya/vc';
import { Editor } from './editor';
import { Compiler } from './helper';
import { COPY } from '../../constants';

export default {
	name: 'c-playground',
	components: {
		'vc-clipboard': Clipboard
	},
	props: {
		source: {
			type: String,
			default: ''
		},
		id: {
			type: String,
			required: true
		}
	},
	data() {
		const locale = this.$route.path.split('/')[1];
		return {
			currentLocale: locale,
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
	created() {
		this.copyText = COPY;
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

				const div = document.createElement('div');
				el.appendChild(div);

				const { module, style } = Compiler.parse(this.code);

				style && Load.cssCode(style, { id: `style___${this.id}` });

				this.codeVM = new Vue(module && module.default ? module.default : module).$mount(div);

				this.error = '';
			} catch (error) {
				this.error = error;

				console.error(error);
			}
		},
		handleEditor() {
			Editor.popup({
				source: this.code,
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
			font-size: 14px;
			line-height: 20px;
			> span {
				cursor: pointer;
				margin-left: 10px;
			}
			> span:last-child {
				font-size: 20px;
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
