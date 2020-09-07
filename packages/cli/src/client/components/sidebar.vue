<template>
	<div class="c-layout-sidebar">
		<div class="c-layout-sidebar__scroller">
			<ul class="">
				<li
					v-for="(item, index) in navs"
					:key="index"
					class="c-layout-sidebar__item"
				>
					<div>
						<router-link
							v-if="item.path"
							:to="`${rootPath}${item.path}`"
							:class="{'is-active': $route.path === `${rootPath}${item.path}`}"
							tag="span"
							class="c-layout-sidebar__item--link"
						>
							{{ item.name | i18n(currentLocale) }}
						</router-link>
						<span v-else>{{ item.name | i18n(currentLocale) }}</span>
					</div>
					<ul v-if="item.children">
						<router-link
							v-for="(subNav, subIndex) in item.children"
							:key="subIndex"
							:class="{'is-active': $route.path === `${rootPath}${subNav.path}`}"
							:to="`${rootPath}${subNav.path}`"
							tag="li"
							class="c-layout-sidebar__item"
						>
							{{ subNav.name | i18n(currentLocale) }}
						</router-link>
					</ul>
					<ul v-else-if="item.group">
						<li
							v-for="(group, groupIndex) in item.group"
							:key="groupIndex"
						>
							<div class="c-layout-sidebar__groupname">
								{{ group.name | i18n(currentLocale) }}
							</div>
							<ul>
								<router-link
									v-for="component in group.list"
									:key="component.path"
									:class="{'is-active': $route.path === `${rootPath}${component.path}`}"
									:to="`${rootPath}${component.path}`"
									tag="li"
									class="c-layout-sidebar__item"
								>
									{{ component.name | i18n(currentLocale) }}
								</router-link>
							</ul>
						</li>
					</ul>
				</li>
			</ul>
		</div>
	</div>
</template>

<script>
import { Message } from '@wya/vc';
import { ajax } from '@wya/http';

export default {
	name: 'c-layout-sidebar',

	data() {
		const [, locale, route] = this.$route.path.split('/');

		return {
			currentLocale: locale,
			rootPath: locale ? `/${locale}/${route}` : `/${route}`,
			navs: []
		};
	},

	mounted() {
		this.$vc.emit('layout-sidebar', { status: true });
		this.$vc.on('locale-change', this.handleUpdate);

		let el = this.$el.querySelector('.c-layout-sidebar__item.is-active');
		el && el.scrollIntoView();

		this.loadNavs();
	},
	beforeDestroy() {
		this.$vc.emit('layout-sidebar', { status: false });
		this.$vc.off('locale-change', this.handleUpdate);
	},
	methods: {
		handleUpdate({ locale }) {
			this.currentLocale = locale;
			this.loadNavs();
		},
		async loadNavs() {
			const { sidebar } = this.$route.meta || {};
			if (typeof sidebar === 'string') {

				let url = `${location.origin}${sidebar}`;
				let data;
				if (__DEV__) {
					try {
						data = (await this.$global.db.read(url) || {}).data;
					} catch (e) {
						console.log(e);
					}
				}
				ajax({
					url,
					onAfter: ({ response }) => {
						return {
							status: 1,
							data: response.data
						};
					},
					localData: data
				}).then((res) => {
					this.navs = res.data;
					__DEV__ && this.$global.db.update({
						__id: url,
						data: res
					});
				}).catch(e => {
					console.log(e);
				});
			} else {
				this.navs = sidebar;
			}
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
		background: white;
		span {
			padding-left: 42px;
			color: #333;
			font-size: 14px;
			letter-spacing: 0px;
			height: 40px;
			line-height: 40px;
			font-weight: 700;
		}
		@include modifier(link) {
			cursor: pointer;
			&:hover {
				color: #2d8cf0!important;
			}
			&.is-active {
				color: #873bf4;
			}
		}

		.c-layout-sidebar__item {
			padding-left: 54px;
			color: #697b8c;
			font-size: 12px;
			letter-spacing: 0px;
			height: 36px;
			line-height: 36px;
			cursor: pointer;
			font-size: 14px;
			font-weight: 400;
			&.is-active {
				border-right: 3px solid #873bf4;
				background-color: #f9f0ff;
				color: #873bf4;
			}
			&:hover {
				background: #f9f9f9;
			}
		}
	}
	@include element(groupname) {
		padding: 10px 0px 0px 54px;
		font-size: 12px;
		color: #999;
		background-color: white;
		line-height: 26px;
	}
}
</style>
