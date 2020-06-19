const path = require('path');
const buble = require('@rollup/plugin-buble');
const replace = require('@rollup/plugin-replace');
const commonjs = require('@rollup/plugin-commonjs');
const nodeResolve = require('@rollup/plugin-node-resolve');
const babel = require('rollup-plugin-babel');
const { uglify } = require('rollup-plugin-uglify');
const postcss = require('rollup-plugin-postcss');
const vue = require('rollup-plugin-vue');

// PostCSS plugins
const simplevars = require('postcss-simple-vars');
const nested = require('postcss-nested');
const preset = require('postcss-preset-env');
const cssnano = require('cssnano');

const external = filename => {
	let regex = [
		'^vue$',
		'^@babel/runtime',
		// 用于测试用例?
		'^@wya/ps$',
		'^@wya/utils$'
	].join('|');

	return new RegExp(`(${regex})`).test(filename);
};

// 添加前缀和其他处理
const BASIC_POSTCSS_PLUGIN = [
	simplevars(),
	nested(),
	preset({
		warnForDuplicates: false,
	})
];

const builds = {
	cli: {
		script: 'babel packages/cli/src --out-dir packages/cli/dist --copy-files --ignore **.test.js,**.md,examples/**',
	},
	playground: {
		script: 'babel packages/playground/src --out-dir packages/playground/dist --copy-files --ignore **.test.js,**.md,examples/**',
		rollup: {
			entry: 'packages/playground/src/index.js',
			dest: 'packages/playground/dist/playground.min.js',
			format: 'cjs',
			globals: {
				vue: 'Vue'
			},
			plugins: [
				vue({
					css: true, // css in js
					style: {
						postcssPlugins: BASIC_POSTCSS_PLUGIN
					}
				}),
				// 使用postcss
				postcss({
					plugins: [
						...BASIC_POSTCSS_PLUGIN,
						cssnano() // 压缩，不能用于vue, 上面要求是async plugin
					],
					extensions: ['.css', '.scss'],
				})
			]
		},
		external,
	},
	utils: {
		script: 'babel packages/utils/src --out-dir packages/utils/dist --copy-files --ignore **.test.js,**.md,examples/**',
		rollup: {
			entry: 'packages/utils/src/index.js',
			dest: 'packages/utils/dist/utils.min.js',
			format: 'cjs'
		}
	}
};

class Config {
	static getConfig = (name) => {
		return {
			...builds[name],
			rollup: Config.getRollupConfig(name)
		};
	}

	static getRollupConfig = (name) => {
		let opts = builds[name].rollup;
		if (!opts) return;

		let config = {
			input: opts.entry,
			external: opts.external,
			plugins: [
				// 使用amd模块引入，第三方模块支持	
				nodeResolve({
					mainFields: ['module', 'jsnext:main', 'main'],
					modulesOnly: true,
					browser: true
				}), 
				// 使用cjs模块引入
				commonjs({
					include: /node_modules/
				}), 
				replace({
					'__DEV__': 'false',
					'ENV': JSON.stringify(process.env.NODE_ENV || 'development'),
					'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development')
				}),
				...(opts.plugins || []),
				babel({
					babelrc: true,
					exclude: 'node_modules/**',
					runtimeHelpers: true
				}),
				buble({
					objectAssign: 'Object.assign' // ...Object spread and rest
				})
				// process.env.NODE_ENV === 'production' && uglify()
			],
			output: {
				file: opts.dest,
				format: opts.format,
				globals: opts.globals,
				// named: opts.moduleName || name,
				exports: 'named'
			}
		};
		return config;
	}

	static getAllBuilds = () => {
		return Object.keys(builds).map(Config.getConfig);
	}
}

module.exports = Config;
