const { expect } = require('chai');
const utils = require('..');

describe('index.js', () => {
	it('验证api', () => {
		expect(typeof utils).to.equal('object');
	});
});
