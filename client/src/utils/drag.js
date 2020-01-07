import { $ } from '@wya/utils';

let isTouch = 'ontouchstart' in document;
let events = {
	start: 'mousedown',
	move: 'mousemove',
	end: 'mouseup'
};
isTouch && (events = {
	start: 'touchstart',
	move: 'touchmove',
	end: 'touchend'
});

/**
 * 目前只针对right / bottom 做处理
 */
export default class Drag {
	constructor(options = {}) {
		const { el, wrapper, container, onEnd } = options;

		if (!el) {
			throw new Error('必传');
		}

		this.el = el;
		this.wrapper = wrapper || el;
		this.container = container || window;
		this.onEnd = onEnd;

		// 内部变量
		this.bottom = 0;
		this.right = 0;

		this.maxRight = ((container.innerWidth || container.clientWidth) - wrapper.offsetWidth);
		this.maxBottom = ((container.innerHeight || container.clientHeight) - wrapper.offsetHeight);

		this.currentX = 0;
		this.currentY = 0;
		this.flag = false;

		let right = $(this.wrapper).getStyle('right');
		let bottom = $(this.wrapper).getStyle('bottom');
		right !== 'auto' && (this.right = right);
		bottom !== 'auto' && (this.bottom = bottom);

		this.handleStart = this.handleStart.bind(this);
		this.handleMove = this.handleMove.bind(this);
		this.handleEnd = this.handleEnd.bind(this);
		el.addEventListener(events.start, this.handleStart, false);
	}

	off() {
		el.removeEventListener(events.start, this.handleStart, false);
	}

	operateDOMEvents(type) {
		let key = type === 'remove' 
			? 'removeEventListener' 
			: 'addEventListener';
		document[key](events.move, this.handleMove, false);
		document[key](events.end, this.handleEnd, false);
	}

	handleStart(e = window.event) {
		this.flag = true;
		e.preventDefault();
		e = isTouch ? e.touches[0] : e;
		this.currentX = e.clientX;
		this.currentY = e.clientY;

		this.operateDOMEvents('add');
	}

	handleMove(e = window.event) {

		e.preventDefault();
		e = isTouch ? e.touches[0] : e;
		if (!this.flag) return;

		let disX = e.clientX - this.currentX;
		let disY = e.clientY - this.currentY;
		let nowRight = parseInt(this.right, 10) - disX;
		let nowBottom = parseInt(this.bottom, 10) - disY;

		nowRight < 0 && (nowRight = 0);
		nowBottom < 0 && (nowBottom = 0);
		nowRight > this.maxRight && (nowRight = this.maxRight);
		nowBottom > this.maxBottom && (nowBottom = this.maxBottom);

		this.wrapper.style.right = nowRight + 'px';
		this.wrapper.style.bottom = nowBottom + 'px';
	}

	handleEnd() {
		const { wrapper } = this;

		this.flag = false;

		let right = $(wrapper).getStyle('right');
		let bottom = $(wrapper).getStyle('bottom');

		right !== 'auto' && (this.right = right);
		bottom !== 'auto' && (this.bottom = bottom);

		this.operateDOMEvents('remove');
	}
}