<template>
	<div class="c-playground-error">
		{{ error }}
	</div>
</template>

<script>
export default {
	name: 'c-playground-error',
	props: {
		error: {
			type: String,
			default: ''
		}
	}
};
</script>

<style lang="scss">
@include block(c-playground-error) {
	display: flex;
	justify-content: center;
	align-items: center;
	height: 100%;
}
</style>
