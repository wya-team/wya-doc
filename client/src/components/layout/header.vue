<template>
	<div class="page-header">
		<div class="page-header__content">
			<!-- <vc-dropdown
				trigger="click"
				placement="bottom"
				@click="handleSwitchVersion"
			>
				<a href="javascript:void(0)">
					{{ currentVersion }}
				</a>
				<template #list>
					<vc-dropdown-menu>
						<vc-dropdown-item 
							v-for="version in versions"
							:key="version"
							:name="version"
						>
							{{ version }}
						</vc-dropdown-item>
					</vc-dropdown-menu>
				</template>
			</vc-dropdown> -->
		</div>
	</div>
</template>

<script>
// import { Dropdown } from '@nm/@wya/vc';

export default {
	name: 'page-header',
	components: {
		// 'vc-dropdown': Dropdown,
		// 'vc-dropdown-item': Dropdown.Item
	},
	data() {
		return {
			currentVersion: '1.9.9',
			versions: ['1.0.0', '1.2.0', '1.9.9']
		};
	},
	methods: {
		handleSwitchVersion(version) {
			console.log(arguments);
			console.log(version);
			if (version !== this.currentVersion) {
				this.currentVersion = version;
				// window.location.href = `${window.origin}/${version}/${window.hash}`;
			}
		}
	}
};
</script>

<style lang="scss">
$block: page-header;

@include block($block) {
	position: fixed;
	top: 0;
	left: 0;
	right: 0;
	height: 80px;
	background-color: #fff;
	@include element(content) {
		margin: 0 auto;
		height: 100%;
		border-bottom: 1px solid $ce8;
	}
}

</style>
