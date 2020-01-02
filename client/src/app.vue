<template>
	<div id="pages">
		<router-view name="header" />
		<router-view name="sidebar" />
		<router-view />
		<router-view name="footer" />
		<router-view name="extra" />
	</div>
</template>

<script>

export default {
	name: 'app',
	data() {
		return {
			sidebar: false,
			footer: false,
			header: false,
			extra: false,
		};
	},
	computed: {
		layoutStatus() {
			const {
				sidebar,
				footer,
				header,
				extra,
			} = this;

			return { 
				sidebar,
				footer,
				header,
				extra,
			};
		},
	},
	created() {
		this.$vc.on('layout-sidebar', ({ status }) => {
			this.sidebar = status;
		});

		this.$vc.on('layout-header', ({ status }) => {
			this.header = status;
		});

		this.$vc.on('layout-footer', ({ status }) => {
			this.footer = status;
		});

		this.$vc.on('layout-extra', ({ status }) => {
			this.extra = status;
		});
	}

};
</script>

<style lang="scss">
#pages {
	padding: 90px 0 0;
	
	display: flex;
	align-content: flex-start;
	justify-content: space-between;
	flex-direction: column;
	flex-shrink: 0;

	position: relative;
	width: 100%;
	min-height: 100vh;
}

</style>
