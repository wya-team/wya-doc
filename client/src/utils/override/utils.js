export const getType = (contentType) => {
	if (!contentType) return 'unknown';

	const type = contentType.split(';')[0].split('/');
	
	const len = type ? type.length : 0;
	const subType = len && type[len - 1];

	return {
		type: type[0],
		subType
	};
};

let link = document.createElement('a');

export const fullUrl = (href) => {
	link.href = href;

	return (
		link.protocol + '//' + link.host + link.pathname + link.search + link.hash
	);
};


export const readBlobAsText = (blob, callback) => {
	const reader = new FileReader();
	reader.onload = () => {
		callback(null, reader.result);
	};
	reader.onerror = err => {
		callback(err);
	};
	reader.readAsText(blob);
};