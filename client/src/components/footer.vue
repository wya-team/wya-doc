<template>
	<div class="c-layout-footer">
		<div class="c-layout-footer__content">
			<div v-for="(item, index) in group" :key="index" class="c-layout-footer__block">
				<div class="c-layout-footer__block--title">
					{{ item.name | i18n(currentLocale) }}
				</div>
				<div class="c-layout-footer__block--content">
					<div v-for="(it, _index) in item.nav" :key="_index" class="c-layout-footer__list">
						<div 
							class="c-layout-footer__item"
							@click="handleNav(item)"
						>
							{{ it.name | i18n(currentLocale) }}
						</div>
					</div>
				</div>
			</div>
		</div>
		<div class="c-layout-footer__copyright">
			{{ copyright | i18n(currentLocale) }}
		</div>
	</div>
</template>

<script>
import { DEFAULT_FOOTER } from '../constants';
import { URLSchema } from '../utils';

export default {
	name: 'c-layout-footer',
	data() {
		const locale = this.$route.path.split('/')[1];
		const { layout = {} } = this.$global.docConfig;
		const { footer = DEFAULT_FOOTER } = layout;
		const { copyright, group } = DEFAULT_FOOTER || [];

		return {
			currentLocale: locale,
			copyright,
			group
		};
	},
	mounted() {
		this.$vc.emit('layout-footer', { status: true });
	},
	beforeDestroy() {
		this.$vc.emit('layout-footer', { status: false });
	},
	methods: {
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
$block: c-layout-footer;
@include block($block) {
	background-color: #141313;
	color: #fff;
	font-size: 14px;
	font-family: PingFangSC-Regular;

	@include element(content) {
		max-width: 1180px;
		margin: 0 auto;
		padding: 100px 0 70px;
		display: flex;
		flex-wrap: wrap;
	}
	@include element(block) {
		flex-grow: 2;
		@include modifier(title) {
			font-size: 16px;
			opacity: .5;
		}
		@include modifier(content) {
			margin-top: 30px;
		}
	}

	@include element(list) {
		display: flex;
		flex-direction: column;
		@include element(item) {
			width: 200px;
			margin: 6px 0;
			cursor: pointer;
			&:hover {
				color: #2d8cf0;
			}
		}
	}
	
	@include element(copyright) {
		text-align: center;
		padding: 16px 40px;
		margin: 0 50px;
		border-top: 1px solid #666;
		color: #999;
	}

}
</style>
