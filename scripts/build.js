const path = require('path');
const fs = require('fs-extra');
const util = require('util');
const exec = util.promisify(require('child_process').exec);

class Builder {
	constructor(config) {
		this.config = config;
	}

	async process() {
		// TODO
	}
}

Config.getAllBuilds().forEach(item => new Builder(item).process());
