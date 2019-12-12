<template>
	<div class="c-layout-footer">
		<div class="c-layout-footer__content">
			<div v-for="(items, index) in lists" :key="index" class="c-layout-footer__block">
				<div class="c-layout-footer__block--title">
					{{ index }}
				</div>
				<div v-for="(item, _index) in items" :key="_index" class="c-layout-footer__block--content">
					<div class="c-layout-footer__list">
						<div>{{ _index }}</div>
					</div>
				</div>
			</div>
		</div>
		<div class="c-layout-footer__copyright">
			Copyright © 2020 WeiYiAn Inc.
		</div>
	</div>
</template>

<script>
export default {
	name: 'c-layout-footer',
	data() {
		return {
			lists: [
				Array.from({ length: 4 }),
				Array.from({ length: 4 }),
				Array.from({ length: 4 }),
				Array.from({ length: 4 })
			]
		};
	},
	mounted() {
		this.$vc.emit('layout-footer', { status: true });
	},
	beforeDestroy() {
		this.$vc.emit('layout-footer', { status: false });
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
			margin-bottom: 15px;
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
