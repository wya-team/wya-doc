<template>
	<div class="c-layout-header">
		<div class="c-layout-header__content">
			<router-link :to="`/${currentLocale}${header.path}`">
				<div class="c-layout-header__icon">
					<img v-if="header.logo" :src="header.logo">
					<span>{{ header.name }}</span>
				</div>
			</router-link>
			<div style="display: flex; align-items: center">
				<div class="c-layout-header__nav">
					<div 
						v-for="(item, index) in header.nav"
						:key="index"
						:class="{'is-active': $route.path === `/${currentLocale}${item.path}`}"
						class="c-layout-header__nav--item" 
						@click="handleNav(item)"
					>
						<span>
							{{ item.name | i18n(currentLocale) }}
						</span>
					</div>
				</div>
				<vc-select 
					v-model="currentLocale" 
					:portal="false"
					style="width: 100px" 
					@change="handleChange"
				>
					<vc-option 
						v-for="(localeName, locale) in locales" 
						:key="locale" 
						:value="locale"
					>
						{{ localeName }}
					</vc-option>
				</vc-select>
			</div>
		</div>
	</div>
</template>

<script>	
import { Storage } from '@wya/utils';
import { LOCALE_TAG, DEFAULT_HEADER } from '../constants';
import { URLSchema } from '../utils';

export default {
	name: 'c-layout-header',
	data() {
		const locale = this.$route.path.split('/')[1];
		const { locales = [], layout = {} } = this.$global.docConfig;
		const { header = DEFAULT_HEADER } = layout;
		return {
			currentLocale: locale,
			locales,
			header
		};
	},
	mounted() {
		this.$vc.emit('layout-header', { status: true });
	},
	beforeDestroy() {
		this.$vc.emit('layout-header', { status: false });
	},
	methods: {
		handleChange(value) {
			Storage.set(LOCALE_TAG, { locale: value });
			this.$global.locale = value;

			const { baseSiteDir } = this.$global.docConfig;
			// REPLACE
			let locale = app.$route.path.split('/');
			locale[1] = value; 
			this.$router.replace(`/${locale.slice(1).join('/')}${location.search}${location.hash}`);

			this.$vc.emit('locale-change', { locale: value });
		},

		handleNav(item) {
			if (item.target || URLSchema.test(item.path)) {
				window.open(item.path, item.target);
			} else {
				this.$router.push(`/${this.currentLocale}${item.path}`);
			}
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
	z-index: 100;
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
		height: 60px;
		padding: 0 30px;

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
			height: 28px;
			line-height: 28px;
			display: inline-block;
			margin-left: 15px;
			font-weight: 600;
			font-size: 16px;
		}
	}
	@include element(nav) {
		display: flex;
		flex-direction: row;
		flex-shrink: 0;
		align-content: flex-start;

		border: 0 solid #000;
		box-sizing: border-box;
		height: 60px;
		@include modifier(item) {
			position: relative;
			display: flex;
			align-items: center;

			font-size: 14px;
			padding: 5px 28px;
			cursor: pointer;
			box-sizing: border-box;
			color: #697b8c;

			&.is-active {
				color: #873bf4;
				box-shadow: inset 0 2px 0 #873bf4;
			}
			&:hover {
				color: #873bf4;
			}
		}
	}

}
</style>
