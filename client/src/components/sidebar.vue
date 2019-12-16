<template>
	<div class="c-layout-sidebar">
		<div class="c-layout-sidebar__scroller">
			<ul class="">
				<li 
					v-for="(oneItem, index) in navs"
					:key="index"
					class="c-layout-sidebar__item"
				>
					<a>{{ oneItem.name }}</a>
					<ul v-if="oneItem.children">
						<li
							v-for="(subNav, subIndex) in oneItem.children"
							:key="subIndex"
							class="c-layout-sidebar__item"
						>
							<router-link :to="`${rootPath}${subNav.path}`">
								{{ subNav.name }}
							</router-link>
						</li>
					</ul>
					<ul v-else-if="oneItem.groups">
						<li
							v-for="(group, groupIndex) in oneItem.groups"
							:key="groupIndex"
						>
							<div class="c-layout-sidebar__groupname">
								{{ group.groupName }}
							</div>
							<ul>
								<li 
									v-for="component in group.list"
									:key="component.path"
									class="c-layout-sidebar__item"
								>
									<router-link :to="`${rootPath}${component.path}`">
										{{ component.title }}
									</router-link>
								</li>
							</ul>
						</li>
					</ul>
				</li>
			</ul>
		</div>
	</div>
</template>

<script>

export default {
	name: 'c-layout-sidebar',
	data() {
		const { sidebar } = this.$route.meta || {};
		const lang = this.$route.path.split('/')[1];
		return {
			rootPath: lang ? `/${lang}/components` : `/components`,
			navs: sidebar
		};
	},


	mounted() {
		this.$vc.emit('layout-sidebar', { status: true });
		this.$vc.on('lang-change', this.handleUpdate);
	},
	beforeDestroy() {
		this.$vc.emit('layout-sidebar', { status: false });
		this.$vc.off('lang-change', this.handleUpdate);
	},
	methods: {
		handleUpdate() {
			const { sidebar } = this.$route.meta || {};
			this.navs = sidebar;
		}
	}
};
</script>

<style lang="scss">
@include block(c-layout-sidebar) {
	width: 260px;
	padding-top: 29px;
	float: left;
	position: fixed;
	top: 0;
	bottom: 0;
	border-right: 1px solid #ededed;
	background: #fff;
	z-index: 1;
	transform: translateX(0);
	@include element(scroller) {
		position: absolute;
		top: 90px;
		right: 0;
		bottom: 0;
		left: 0;
		overflow: auto;
	}
	@include element(item) {
		a {
			padding-left: 42px;
			// color: #f29718;
			font-size: 14px;
			letter-spacing: 0px;
			height: 40px;
			line-height: 40px;
		}
		&.c-layout-sidebar__item a {
			padding-left: 54px;
			color: #666;
			font-size: 12px;
			font-family: PingFangSC-Light;
			letter-spacing: 0px;
			height: 36px;
			line-height: 36px;
			cursor: pointer;
			font-size: 14px;
		}
	}
	@include element(groupname) {
		padding: 8px 0 8px 54px;
		font-size: 12px;
		color: #000;
	}
}
</style>
