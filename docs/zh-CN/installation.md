## 安装

> zh-CN

:::TIP
zh-CN
:::

:::WARNING
zh-CN
:::

### Basic

:::RUNTIME
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

### Portal

:::RUNTIME
```html
<template>
	<div class="v-installation-2">
		<div @click="handleClick">功能2</div>
	</div>
</template>

<script>
import { Portal } from '@wya/vc';

const wrapperComponent = {
	name: 'v-portal',
	mounted() {
		console.log('mounted');
	},
	methods: {
		handleClick() {
			alert('click');
		}
	}
};

export default wrapperComponent;
export const Editor = new Portal(wrapperComponent); 
</script>

<style>
.v-installation-2 div {
	color: #873bf4;
};
</style>
```
:::


## 标题

Markdown 语法：

```
# 第一级标题 `<h1>` 
## 第二级标题 `<h2>` 
###### 第六级标题 `<h6>` 
```

效果如下：

# 第一级标题 `<h1>` 
## 第二级标题 `<h2>` 
###### 第六级标题 `<h6>` 



## 强调

Markdown 语法：

```
*这些文字会生成`<em>`*
_这些文字会生成`<u>`_

**这些文字会生成`<strong>`**
__这些文字会生成`<strong>`__
```

在 MWeb 中的快捷键为： `CMD + U`、`CMD + I`、`CMD + B`
效果如下：

*这些文字会生成`<em>`*
_这些文字会生成`<u>`_

**这些文字会生成`<strong>`**
__这些文字会生成`<strong>`__

## 换行

四个及以上空格加回车。

## 列表

### 无序列表

Markdown 语法：

```
* 项目一 无序列表 `* + 空格键`
* 项目二
* 项目二的子项目一 无序列表 `TAB + * + 空格键`
* 项目二的子项目二
```

在 MWeb 中的快捷键为： `Option + U`
效果如下：

* 项目一 无序列表 `* + 空格键`
* 项目二
* 项目二的子项目一 无序列表 `TAB + * + 空格键`
* 项目二的子项目二

### 有序列表

Markdown 语法：

```
1. 项目一 有序列表 `数字 + . + 空格键`
2. 项目二 
3. 项目三
1. 项目三的子项目一 有序列表 `TAB + 数字 + . + 空格键`
2. 项目三的子项目二
```

效果如下：

1. 项目一 有序列表 `数字 + . + 空格键`
2. 项目二 
3. 项目三
1. 项目三的子项目一 有序列表 `TAB + 数字 + . + 空格键`
2. 项目三的子项目二

### 任务列表（Task lists）

Markdown 语法：

```
- [ ] 任务一 未做任务 `- + 空格 + [ ]`
- [x] 任务二 已做任务 `- + 空格 + [x]`
```

效果如下：

- [ ] 任务一 未做任务 `- + 空格 + [ ]`
- [x] 任务二 已做任务 `- + 空格 + [x]`

## 图片

Markdown 语法：

```
![wya-team](https://avatars3.githubusercontent.com/u/34465004?s=200&v=4)
格式: ![Alt Text](url)
```

效果如下：

![wya-team](https://avatars3.githubusercontent.com/u/34465004?s=200&v=4)


## 链接

Markdown 语法：

```
email <example@example.com>
[GitHub](http://github.com)
自动生成连接  <http://www.github.com/>
```

效果如下：

Email 连接： <example@example.com>
[连接标题Github网站](http://github.com)
自动生成连接像： <http://www.github.com/> 这样


## 区块引用

Markdown 语法：

```
某某说:
> 第一行引用
> 第二行费用文字
```

效果如下

某某说:
> 第一行引用
> 第二行费用文字

## 行内代码

Markdown 语法：

```
像这样即可：`<addr>` `code`
```
效果如下：

像这样即可：`<addr>` `code`

## 表格

Markdown 语法：

```
第一格表头 | 第二格表头
--------- | -------------
内容单元格 第一列第一格 | 内容单元格第二列第一格
内容单元格 第一列第二格 多加文字 | 内容单元格第二列第二格
```

效果如下：

第一格表头 | 第二格表头
--------- | -------------
内容单元格 第一列第一格 | 内容单元格第二列第一格
内容单元格 第一列第二格 多加文字 | 内容单元格第二列第二格


## 删除线

Markdown 语法：

加删除线像这样用： ~~删除这些~~

效果如下：

加删除线像这样用： ~~删除这些~~

## 分隔线

以下三种方式都可以生成分隔线：

***

*****

- - -

效果如下：

***

*****

- - -





