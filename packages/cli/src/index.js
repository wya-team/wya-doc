#!/usr/bin/env node
const chalk = require('chalk');
const program = require('cac')();
const { resolve } = require('path');
const App = require('./node');

const { log } = console;
program
	.version(require('../package').version);

// 使用指令参数 如 wya server;
program
	.usage('<cmd>');

// doc dev
program
	.command('dev [sourceDir]', 'development mode')
	.option('-p, --port <port>', 'server port (default: 8080)')
	.option('--host <host>', 'server host (default: 0.0.0.0)')
	.option('--config <config file>', 'config options file')
	.action((sourceDir = '.', commandOptions) => {
		let app = new App({
			sourceDir: resolve(sourceDir),
			...commandOptions
		});

		app.dev();
	});

// doc build
program
	.command('build [targetDir]', 'production mode')
	.option('-d, --dest <dest>', 'build output dir (default: docs/dist)')
	.action((sourceDir = '.', commandOptions) => {
		let app = new App({
			sourceDir: resolve(sourceDir),
			...commandOptions
		});
		app.build();
	});

// 任意匹配
program
	.command('*')
	.action((cmd) => log(chalk`{red Invalid mode ${cmd}}`));

program.help();
program.version('1.0.0');
program.parse();
