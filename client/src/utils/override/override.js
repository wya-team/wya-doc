import Fetch from './fetch';
import XHR from './xhr';

class Override {
	constructor() {
		this._isFetchSupported = !!window.fetch;
		this._origFetch = null;

		this._requests = {};

		this.overrideFetch();
		this.overrideXHR();
	}

	overrideFetch() {
		if (!this._isFetchSupported) return;

		this._origFetch = window.fetch;
		let origFetch = window.fetch;

		let self = this;
		window.fetch = function (...args) {
			const req = new Fetch(...args);
			req.on(`send__${req._id}`, (data) => self._addReq(req._id, data));
			req.on(`update__${req._id}`, (data) => self._updateReq(req._id, data));

			const fetchResult = origFetch(...args);
			req.send(fetchResult);

			return fetchResult;
		};
	}

	restoreFetch() {
		if (!this._isFetchSupported) return;

		if (this._origFetch) window.fetch = this._origFetch;
	}

	overrideXHR() {
		const winXHRProto = window.XMLHttpRequest.prototype;

		this._origSend = winXHRProto.send;
		this._origOpen = winXHRProto.open;
		this._origSetRequestHeader = winXHRProto.setRequestHeader;

		let origSend = winXHRProto.send;
		let origOpen = winXHRProto.open;
		let origSetRequestHeader = winXHRProto.setRequestHeader;

		const self = this;

		winXHRProto.open = function (method, url) {
			const xhr = this;

			const req = new XHR(xhr, method, url);

			xhr._Request = req;

			req.on(`send__${req._id}`, (data) => self._addReq(req._id, data));
			req.on(`update__${req._id}`, (data) => self._updateReq(req._id, data));

			xhr.addEventListener('readystatechange', () => {
				let fns = {
					2: () => req.handleHeadersReceived(),
					4: () => req.handleDone()
				};
				fns[xhr.readyState] && fns[xhr.readyState]();
			});

			origOpen.apply(this, arguments);
		};

		winXHRProto.send = function (data) {
			const req = this._Request;
			if (req) req.handleSend(data);

			origSend.apply(this, arguments);
		};

		winXHRProto.setRequestHeader = function (key, val) {
			const req = this.erudaRequest;
			if (req) req.handleReqHeadersSet(key, val);

			origSetRequestHeader.apply(this, arguments);
		};
	}
	
	restoreXHR() {
		const winXHRProto = window.XMLHttpRequest.prototype;

		if (this._origOpen) winXHRProto.open = this._origOpen;
		if (this._origSend) winXHRProto.send = this._origSend;
		if (this._origSetRequestHeader) winXHRProto.setRequestHeader = this._origSetRequestHeader;
	}

	_addReq(id, data) {
		data = {
			name: '',
			url: '',
			status: 'pending',
			type: 'unknown',
			subType: 'unknown',
			size: 0,
			data: '',
			method: 'GET',
			startTime: new Date().getTime(),
			time: 0,
			resTxt: '',
			done: false,
			...data
		};

		this._requests[id] = data;

		this._render();
	}

	_updateReq(id, data) {
		let target = this._requests[id];
		if (!target) return;

		target = Object.assign(target, data);

		target.time -= target.startTime;

		if (target.done && (target.status < 200 || target >= 300)) target.hasErr = true;

		this._render();
	}

	_render() {

	}
}
window.request = new Override();