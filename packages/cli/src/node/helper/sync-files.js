const path = require('path');
const fs = require('fs-extra');
const chokidar = require('chokidar');

export default (sourceDir, copyDir, opts = {}) => {
	fs.emptyDirSync(copyDir);
	fs.copySync(sourceDir, copyDir);

	const { globType, watch } = opts;
	if (!watch) return;

	let fileWatcher = chokidar.watch(
		globType || ['**/*.js', '**/*.md', '**/*.vue'], 
		{
			cwd: sourceDir,
			ignored: ['node_modules'],
			ignoreInitial: true
		}
	);	

	fileWatcher.on('all', (type, fullpath) => {
		let sourceFullpath = fullpath;

		if (!path.isAbsolute(fullpath)) {
			fullpath = path.join(copyDir, fullpath);
			sourceFullpath = path.join(sourceDir, fullpath);
		}
		// 操作 js / md / vue
		switch (type) {
			case 'add':
			case 'change':
				// copy
				fs.ensureDirSync(path.dirname(fullpath));
				fs.copySync(sourceFullpath, fullpath);
				break;
			case 'addDir':
				fs.ensureDirSync(path.dirname(fullpath));
				break;
			case 'unlink':
			case 'unlinkDir':
				fs.removeSync(fullpath);
				break;
			default:
				return;
		}
	});

	return () => {
		if (fileWatcher) {
			fileWatcher.close();
			fileWatcher = null;
		}
	};
};
