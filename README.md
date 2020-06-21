# wya-doc
微一案工具链文档生成辅助工具

- [Demo & Documents](https://wya-team.github.io/wya-doc/site/index.html)

### 安装

- 全局

```
# 避免权限问题，这样安装
sudo npm install -g --unsafe-perm --verbose @wya/doc-cli
```

- 跟随项目

```
npm install @wya/doc-cli -D
```

### TODO

- Scss 在线编译(node-sass -> browser-sass -> @wya/doc-sass)
- 样式域(style scoped)
- 自适应（responsive -> 移动端）
- 多文件管理（playground -> super editor🔥）
- 路由的动态解析（dynamic routes -> 网络的json文件，目前是本地文件🆙）
- IndexedDB 结合 Webpack 做缓存
- Socket 和 HTTP 使用同一端口👿

