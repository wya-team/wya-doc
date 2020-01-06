## 安装

> zh-CN

### 功能1

:::demo 最后，这是一个同时具有 icon 和辅助性文字的样例。
```html
<template>
	<div class="v-installation-1">
		<div @click="handleClick">功能1</div>
	</div>
</template>

<script>
export default {
	mounted() {
		console.log('mounted');
	},
	methods: {
		handleClick() {
			alert('click');
		}
	}
};
</script>
<style>
.v-installation-1 div {
	color: red;
};
</style>
```
:::

### 功能2

:::demo 最后，这是一个同时具有 icon 和辅助性文字的样例。
```html
<template>
	<div class="v-installation-2">
		<div @click="handleClick">功能2</div>
	</div>
</template>

<script>
export default {
	mounted() {
		console.log('mounted');
	},
	methods: {
		handleClick() {
			alert('click');
		}
	}
};
</script>

<style>
.v-installation-2 div {
	color: yellow;
};
</style>
```
:::

##

header 1 | header 2
---|---
row 1 col 1 | row 1 col 2
row 2 col 1 | row 2 col 2

