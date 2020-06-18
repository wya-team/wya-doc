export default [{
	path: '/zh-CN/',
	redirect: '/zh-CN/index'
}, {
	path: '/zh-CN/index',
	meta: {
		sidebar: null
	},
	components: {
		default: require('/Users/deot/Desktop/wya/github/wya-doc/docs/zh-CN/components/index.vue').default,
		header: require('/Users/deot/Desktop/wya/github/wya-doc/packages/client/lib/src/components/header.vue').default,
		footer: require('/Users/deot/Desktop/wya/github/wya-doc/packages/client/lib/src/components/footer.vue').default,
		extra: null,
		sidebar: null,
	},
}, {
	path: '/zh-CN/components/:name',
	meta: {
		sidebar: [{
			"path": "/changelog",
			"name": {
				"zh-CN": "更新日志",
				"en-US": "Changelog"
			}
		}, {
			"name": {
				"zh-CN": "开发指南",
				"en-US": "Development"
			},
			"children": [{
				"path": "/installation",
				"name": {
					"zh-CN": "安装",
					"en-US": "Installation"
				}
			}, {
				"path": "/quickstart",
				"name": {
					"zh-CN": "快速上手",
					"en-US": "Quick Start"
				}
			}, {
				"path": "/i18n",
				"name": {
					"zh-CN": "国际化",
					"en-US": "Internationalization"
				}
			}]
		}, {
			"name": {
				"zh-CN": "组合",
				"en-US": "Group"
			},
			"group": [{
				"name": {
					"zh-CN": "组合 1",
					"en-US": "Group 1"
				},
				"list": [{
					"path": "/children-group-11",
					"name": {
						"zh-CN": "子 1 - 1",
						"en-US": "children 1 - 1"
					}
				}, {
					"path": "/children-group-12",
					"name": {
						"zh-CN": "子 1 - 2",
						"en-US": "children 1 - 2"
					}
				}, {
					"path": "/children-group-13",
					"name": {
						"zh-CN": "子 1 - 3",
						"en-US": "children 1 - 3"
					}
				}]
			}, {
				"name": {
					"zh-CN": "组合 2",
					"en-US": "Group 2"
				},
				"list": [{
					"path": "/children-group-21",
					"name": {
						"zh-CN": "子 2 - 1",
						"en-US": "children 2 - 1"
					}
				}, {
					"path": "/children-group-22",
					"name": {
						"zh-CN": "子 2 - 2",
						"en-US": "children 2 - 2"
					}
				}, {
					"path": "/children-group-23",
					"name": {
						"zh-CN": "子 2 - 3",
						"en-US": "children 2 - 3"
					}
				}]
			}]
		}]
	},
	components: {
		default: require('/Users/deot/Desktop/wya/github/wya-doc/packages/client/lib/src/components/default.vue').default,
		header: require('/Users/deot/Desktop/wya/github/wya-doc/packages/client/lib/src/components/header.vue').default,
		footer: require('/Users/deot/Desktop/wya/github/wya-doc/packages/client/lib/src/components/footer.vue').default,
		extra: null,
		sidebar: require('/Users/deot/Desktop/wya/github/wya-doc/packages/client/lib/src/components/sidebar.vue').default,
	},
}, {
	path: '/zh-CN/api/:name',
	meta: {
		sidebar: [{
			"path": "/changelog",
			"name": {
				"zh-CN": "更新日志",
				"en-US": "Changelog"
			}
		}, {
			"name": {
				"zh-CN": "开发指南",
				"en-US": "Development"
			},
			"children": [{
				"path": "/installation",
				"name": {
					"zh-CN": "安装",
					"en-US": "Installation"
				}
			}, {
				"path": "/quickstart",
				"name": {
					"zh-CN": "快速上手",
					"en-US": "Quick Start"
				}
			}, {
				"path": "/i18n",
				"name": {
					"zh-CN": "国际化",
					"en-US": "Internationalization"
				}
			}]
		}, {
			"name": {
				"zh-CN": "组合",
				"en-US": "Group"
			},
			"group": [{
				"name": {
					"zh-CN": "组合 1",
					"en-US": "Group 1"
				},
				"list": [{
					"path": "/children-group-11",
					"name": {
						"zh-CN": "子 1 - 1",
						"en-US": "children 1 - 1"
					}
				}, {
					"path": "/children-group-12",
					"name": {
						"zh-CN": "子 1 - 2",
						"en-US": "children 1 - 2"
					}
				}, {
					"path": "/children-group-13",
					"name": {
						"zh-CN": "子 1 - 3",
						"en-US": "children 1 - 3"
					}
				}]
			}, {
				"name": {
					"zh-CN": "组合 2",
					"en-US": "Group 2"
				},
				"list": [{
					"path": "/children-group-21",
					"name": {
						"zh-CN": "子 2 - 1",
						"en-US": "children 2 - 1"
					}
				}, {
					"path": "/children-group-22",
					"name": {
						"zh-CN": "子 2 - 2",
						"en-US": "children 2 - 2"
					}
				}, {
					"path": "/children-group-23",
					"name": {
						"zh-CN": "子 2 - 3",
						"en-US": "children 2 - 3"
					}
				}]
			}]
		}]
	},
	components: {
		default: require('/Users/deot/Desktop/wya/github/wya-doc/packages/client/lib/src/components/default.vue').default,
		header: require('/Users/deot/Desktop/wya/github/wya-doc/docs/zh-CN/components/header.vue').default,
		footer: require('/Users/deot/Desktop/wya/github/wya-doc/docs/zh-CN/components/footer.vue').default,
		extra: null,
		sidebar: require('/Users/deot/Desktop/wya/github/wya-doc/packages/client/lib/src/components/sidebar.vue').default,
	},
}, {
	path: '*',
	redirect: (to) => {
		return '/zh-CN/index';
	}
}, {
	path: '/en-US/',
	redirect: '/en-US/index'
}, {
	path: '/en-US/index',
	meta: {
		sidebar: null
	},
	components: {
		default: require('/Users/deot/Desktop/wya/github/wya-doc/docs/en-US/components/index.vue').default,
		header: require('/Users/deot/Desktop/wya/github/wya-doc/packages/client/lib/src/components/header.vue').default,
		footer: require('/Users/deot/Desktop/wya/github/wya-doc/packages/client/lib/src/components/footer.vue').default,
		extra: null,
		sidebar: null,
	},
}, {
	path: '/en-US/components/:name',
	meta: {
		sidebar: [{
			"path": "/changelog",
			"name": {
				"zh-CN": "更新日志",
				"en-US": "Changelog"
			}
		}, {
			"name": {
				"zh-CN": "开发指南",
				"en-US": "Development"
			},
			"children": [{
				"path": "/installation",
				"name": {
					"zh-CN": "安装",
					"en-US": "Installation"
				}
			}, {
				"path": "/quickstart",
				"name": {
					"zh-CN": "快速上手",
					"en-US": "Quick Start"
				}
			}, {
				"path": "/i18n",
				"name": {
					"zh-CN": "国际化",
					"en-US": "Internationalization"
				}
			}]
		}, {
			"name": {
				"zh-CN": "组合",
				"en-US": "Group"
			},
			"group": [{
				"name": {
					"zh-CN": "组合 1",
					"en-US": "Group 1"
				},
				"list": [{
					"path": "/children-group-11",
					"name": {
						"zh-CN": "子 1 - 1",
						"en-US": "children 1 - 1"
					}
				}, {
					"path": "/children-group-12",
					"name": {
						"zh-CN": "子 1 - 2",
						"en-US": "children 1 - 2"
					}
				}, {
					"path": "/children-group-13",
					"name": {
						"zh-CN": "子 1 - 3",
						"en-US": "children 1 - 3"
					}
				}]
			}, {
				"name": {
					"zh-CN": "组合 2",
					"en-US": "Group 2"
				},
				"list": [{
					"path": "/children-group-21",
					"name": {
						"zh-CN": "子 2 - 1",
						"en-US": "children 2 - 1"
					}
				}, {
					"path": "/children-group-22",
					"name": {
						"zh-CN": "子 2 - 2",
						"en-US": "children 2 - 2"
					}
				}, {
					"path": "/children-group-23",
					"name": {
						"zh-CN": "子 2 - 3",
						"en-US": "children 2 - 3"
					}
				}]
			}]
		}]
	},
	components: {
		default: require('/Users/deot/Desktop/wya/github/wya-doc/packages/client/lib/src/components/default.vue').default,
		header: require('/Users/deot/Desktop/wya/github/wya-doc/packages/client/lib/src/components/header.vue').default,
		footer: require('/Users/deot/Desktop/wya/github/wya-doc/packages/client/lib/src/components/footer.vue').default,
		extra: null,
		sidebar: require('/Users/deot/Desktop/wya/github/wya-doc/packages/client/lib/src/components/sidebar.vue').default,
	},
}, {
	path: '/en-US/api/:name',
	meta: {
		sidebar: [{
			"path": "/changelog",
			"name": {
				"zh-CN": "更新日志",
				"en-US": "Changelog"
			}
		}, {
			"name": {
				"zh-CN": "开发指南",
				"en-US": "Development"
			},
			"children": [{
				"path": "/installation",
				"name": {
					"zh-CN": "安装",
					"en-US": "Installation"
				}
			}, {
				"path": "/quickstart",
				"name": {
					"zh-CN": "快速上手",
					"en-US": "Quick Start"
				}
			}, {
				"path": "/i18n",
				"name": {
					"zh-CN": "国际化",
					"en-US": "Internationalization"
				}
			}]
		}, {
			"name": {
				"zh-CN": "组合",
				"en-US": "Group"
			},
			"group": [{
				"name": {
					"zh-CN": "组合 1",
					"en-US": "Group 1"
				},
				"list": [{
					"path": "/children-group-11",
					"name": {
						"zh-CN": "子 1 - 1",
						"en-US": "children 1 - 1"
					}
				}, {
					"path": "/children-group-12",
					"name": {
						"zh-CN": "子 1 - 2",
						"en-US": "children 1 - 2"
					}
				}, {
					"path": "/children-group-13",
					"name": {
						"zh-CN": "子 1 - 3",
						"en-US": "children 1 - 3"
					}
				}]
			}, {
				"name": {
					"zh-CN": "组合 2",
					"en-US": "Group 2"
				},
				"list": [{
					"path": "/children-group-21",
					"name": {
						"zh-CN": "子 2 - 1",
						"en-US": "children 2 - 1"
					}
				}, {
					"path": "/children-group-22",
					"name": {
						"zh-CN": "子 2 - 2",
						"en-US": "children 2 - 2"
					}
				}, {
					"path": "/children-group-23",
					"name": {
						"zh-CN": "子 2 - 3",
						"en-US": "children 2 - 3"
					}
				}]
			}]
		}]
	},
	components: {
		default: require('/Users/deot/Desktop/wya/github/wya-doc/packages/client/lib/src/components/default.vue').default,
		header: require('/Users/deot/Desktop/wya/github/wya-doc/docs/en-US/components/header.vue').default,
		footer: require('/Users/deot/Desktop/wya/github/wya-doc/docs/en-US/components/footer.vue').default,
		extra: null,
		sidebar: require('/Users/deot/Desktop/wya/github/wya-doc/packages/client/lib/src/components/sidebar.vue').default,
	},
}, {
	path: '*',
	redirect: (to) => {
		return '/zh-CN/index';
	}
}, ];