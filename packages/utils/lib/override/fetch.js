import { EventStore } from '@wya/ps';
import { Utils } from '@wya/utils';
import { fullUrl, getType } from './utils';

export default class FetchRequest extends EventStore {
	constructor(url, options = {}) {
		super();

		if (url instanceof window.Request) url = url.url;

		this._url = fullUrl(url);
		this._id = Utils.getUid('request');
		this._options = options;
		this._reqHeaders = options.headers || {};
		this._method = options.method || 'GET';
	}

	send(fetchResult) {
		const options = this._options;

		this._fetch = fetchResult;
		this.emit(`send__${this._id}`, {
			url: this._url,
			data: options.body || '',
			method: this._method
		});

		fetchResult.then(res => {
			res = res.clone();

			const type = getType(res.headers.get('Content-Type'));
			res.text().then(resTxt => {
				const data = {
					type: type.type,
					subType: type.subType,
					time: new Date().getTime(),
					resTxt,
					status: res.status,
					done: true
				};
				if (this._reqHeaders) {
					data.reqHeaders = this._reqHeaders;
				}
				this.emit(`update__${this._id}`, data);
			});

			return res;
		});
	}
}