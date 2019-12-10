<template>
	<div class="demo-block">
		<slot />
		<slot name="source" />
		<div class="highlight">
			<slot name="highlight" />
		</div>
	</div>
</template>

<script>
export default {
	name: ''
};
</script>

<style lang="scss">

</style>
