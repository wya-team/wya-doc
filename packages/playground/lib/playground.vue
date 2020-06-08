<template>
	<div class="c-playground">
		<div class="c-playground__header">
			<div class="c-playground__tools">
				<vc-clipboard :value="code" tag="span">
					{{ copyText | i18n(currentLocale) }}
				</vc-clipboard>
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
import { Clipboard } from '@wya/vc';
import { Compiler, Load } from '@wya/doc-utils';
import { Editor } from './popup/editor';

const COPY = {
	'zh-CN': "复制",
	'en-US': "Copy",
};

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

<style>
.c-playground {
	width: 100%;
	display: flex;
	justify-content: center;
	flex-direction: column;
	box-shadow: rgb(229, 229, 229) 0px 0px 10px;
	margin-bottom: 16px;
}
.c-playground__header {
	display: flex;
	justify-content: flex-end;
	align-items: center;
	background: #f6f8fa !important;
	padding: 10px;
}
.c-playground__tools {
	display: flex;
	align-items: center;
	font-size: 14px;
	line-height: 20px;
}
.c-playground__tools > span {
	cursor: pointer;
	margin-left: 10px;
}
.c-playground__tools > span:last-child {
	font-size: 20px;
}
.c-playground__error {
	display: flex;
	justify-content: center;
	align-items: center;
	height: 100%;
}
.c-playground__preview {
	padding: 10px;
	margin-top: 10px;
}
</style>
