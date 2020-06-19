const { expect } = require('chai');
const cli = require('..');

describe('index.js', () => {
	it('验证api', () => {
		expect(typeof cli).to.equal('object');
	});
});
