<template>
	<div id="pages">
		<div class="page__wrapper">
			<router-view name="header" />
			<div class="page-main__wrapper">
				<router-view name="sidebar" class="page-main__sidebar" />
				<section class="page-main__content">
					<router-view />
				</section>
			</div>
			<router-view name="footer" />
		</div>
		<router-view name="extra" />
	</div>
</template>

<script>

export default {
	name: 'app'
};
</script>

<style lang="scss">
.page-wrapper {
	@include block(page-main) {
		@include element(wrapper) {
			display: flex;
			margin: 80px auto 0;
		}
		
		@include element(sidebar) {
			margin-right: 40px;
		}
		@include element(content) {
			// overflow: auto;
			flex: 1;
			table {
				border-collapse: collapse;
				width: 100%;
				font-size: 14px;
				background-color: #fff;
				th {
					padding: 20px 0;
					border-bottom: 1px solid $c-border;
					color: $c999;
					font-weight: 400;
					text-align: left;
				}
				tr {
					border-bottom: 1px solid $c-border;
				}
				td {
					padding: 15px 0;
					color: $c666;
				}
			}

			.header-anchor {
				float: left;
				opacity: 0;
				margin-left: -20px;
			}
			h2, h3, h4, h5, h6 {
				&:hover .header-anchor {
					opacity: 1;
				}
			}
		}
	}
}
</style>
