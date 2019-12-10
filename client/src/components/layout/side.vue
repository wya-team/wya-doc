<template>
	<div class="side-nav">
		<ul class="">
			<li 
				v-for="(oneItem, index) in navs"
				:key="index"
				class="side-nav__item"
			>
				<a>{{ oneItem.name }}</a>
				<ul v-if="oneItem.children" clas="sub-nav">
					<li
						v-for="(subNav, subIndex) in oneItem.children"
						:key="subIndex"
						class="side-nav__item"
					>
						<a :href="`#${subNav.path}`">{{ subNav.name }}</a>
					</li>
				</ul>
				<ul v-else-if="oneItem.groups" clas="sub-nav">
					<li
						v-for="(group, groupIndex) in oneItem.groups"
						:key="groupIndex"
					>
						<div class="side-nav__groupname">
							{{ group.groupName }}
						</div>
						<ul>
							<li 
								v-for="component in group.list"
								:key="component.path"
								class="side-nav__item"
							>
								<a :href="`#${component.path}`">{{ component.title }}</a>
							</li>
						</ul>
					</li>
				</ul>
			</li>
		</ul>
	</div>
</template>

<script>
import sideNav from '@/nav-side';

console.log(window.lang);

export default {
	name: 'side-nav',
	data() {
		return {
			navs: sideNav instanceof Object ? sideNav[window.lang] : sideNav
		};
	}
};
</script>

<style lang="scss">
@include block(side-nav) {
	overflow: auto;
	padding: 0 40px 0 0;
	flex-shrink: 0;
	height: calc(100vh - 80px);
	@include element(item) {
		a {
			display: block;
			padding: 15px 0;
			font-size: 16px;
			color: #333;
		}
		& .side-nav__item a {
			padding: 10px 0;
			font-size: 14px;
			color: #515151;
			&:hover {
				color: $main;
			}
		}
	}
	@include element(groupname) {
		padding: 8px 0;
		font-size: 12px;
		color: #999999;
	}
}
</style>
