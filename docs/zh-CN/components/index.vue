<template>
	<div class="v-index">
		<router-link to="/zh-CN/components/alert">
			<h1>Hello @wya/doc - zh-CN</h1>
		</router-link>
		<c-playground />
	</div>
</template>

<script>
export default {
	name: 'v-index',
	
};
</script>

<style lang="scss">
.v-index {
	display: flex;
	align-items: center;
	justify-content: center;
	flex: 1;
}
</style>
