<template>
	<div class="vc-alert">
		{{ title }}
	</div>
</template>

<script>
export default {
	name: 'vc-alert',
	props: {
		title: {
			type: String,
			default: ''
		}
	}
};
</script>

<style lang="scss">
.vc-alert {
	color: #5495f6;
}
</style>
