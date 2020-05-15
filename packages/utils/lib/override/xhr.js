import { EventStore } from '@wya/ps';
import { Utils } from '@wya/utils';
import { fullUrl, getType, readBlobAsText } from './utils';

export default class XHR extends EventStore {
	constructor(xhr, method, url) {
		super();

		this._xhr = xhr;
		this._reqHeaders = {};
		this._method = method;
		this._url = fullUrl(url);
		this._id = Utils.getUid('request');
	}

	handleSend(data = '') {
		let newData = {
			url: this._url,
			data,
			method: this._method
		};
		if (this._reqHeaders) {
			newData.reqHeaders = this._reqHeaders;
		}
		this.emit(`send__${this._id}`, newData);
	}

	handleReqHeadersSet(key, val) {
		if (key && val) {
			this._reqHeaders[key] = val;
		}
	}

	handleHeadersReceived() {
		const xhr = this._xhr;

		const type = getType(xhr.getResponseHeader('Content-Type'));
		this.emit(`update__${this._id}`, {
			type: type.type,
			subType: type.subType,
			time: new Date().getTime(),
		});
	}

	handleDone() {
		const xhr = this._xhr;
		const resType = xhr.responseType;
		let resTxt = '';

		const update = () => {
			this.emit(`update__${this._id}`, {
				status: xhr.status,
				done: true,
				time: new Date().getTime(),
				resTxt
			});
		};

		const type = getType(xhr.getResponseHeader('Content-Type'));
		if (
			resType === 'blob'
			&& (type.type === 'text'
				|| type.subType === 'javascript'
				|| type.subType === 'json')
		) {
			readBlobAsText(xhr.response, (err, result) => {
				if (result) resTxt = result;
				update();
			});
		} else {
			if (resType === '' || resType === 'text') resTxt = xhr.responseText;
			if (resType === 'json') resTxt = JSON.stringify(xhr.response);

			update();
		}
	}
}
