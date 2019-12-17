<template>
	<div class="c-layout-header">
		<div class="c-layout-header__content">
			<router-link to="/zh-CN/index">
				<div class="c-layout-header__icon">
					<img src="https://avatars3.githubusercontent.com/u/34465004?s=200&v=4" alt="">
					<span>@wya/doc</span>
				</div>
			</router-link>
			<select v-model="currentLang" @change="handleChange">
				<option 
					v-for="lang in langs" 
					:key="lang" 
					:value="lang"
				>
					{{ lang }}
				</option>
			</select>
		</div>
	</div>
</template>

<script>	
import { Storage } from '@wya/utils';
import { LANG_TAG } from '../constants';

export default {
	name: 'c-layout-header',
	data() {
		const lang = this.$route.path.split('/')[1];
		return {
			currentLang: lang,
			langs: ['zh-CN', 'en-US']
		};
	},
	mounted() {
		this.$vc.emit('layout-header', { status: true });
	},
	beforeDestroy() {
		this.$vc.emit('layout-header', { status: false });
	},
	methods: {
		handleChange(e) {
			let value = e.target.value;
			Storage.set(LANG_TAG, { lang: value });
			this.$global.lang = value;

			// REPLACE
			let lang = app.$route.path.split('/');
			lang[1] = value; 
			this.$router.replace(`${__DOC_SITE__}${lang.slice(1).join('/')}${location.search}${location.hash}`);

			this.$vc.emit('lang-change');
		}
	}
};
</script>

<style lang="scss">
$block: c-layout-header;
@include block($block) {
	display: flex;
	flex-direction: column;
	align-content: flex-start;
	flex-shrink: 0;

	position: fixed;
	top: 0px;
	z-index: 99999;
	width: 100%;

	background-color: #fff;
	box-shadow: rgb(240, 241, 242) 0px 2px 8px;

	@include element(content) {
		display: flex;
		align-items: center;
		align-content: flex-start;
		justify-content: space-between;
		flex-direction: row;
		flex-shrink: 0;

		margin: 0 auto;
		width: 100%;
		padding: 15px 30px;

		border: 0 solid #000;
		box-sizing: border-box;
	}
	@include element(icon) {
		display: flex;
		flex-direction: row;
		align-items: center;
		align-content: flex-start;
		flex-shrink: 0;
		position: relative;
		cursor: pointer;

		img {
			height: 28px;
			display: inline-block;
		}
		span {
			height: 15px;
			display: inline-block;
			margin-left: 15px;

		}
	}

}
</style>
