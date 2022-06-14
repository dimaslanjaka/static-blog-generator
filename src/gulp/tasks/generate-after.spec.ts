import { expect } from 'chai';
import 'mocha';
import { filter_external_links } from './generate-after';

describe('Test Safelink (filter_external_links)', async () => {
  it('check external link', () => {
    const test = filter_external_links('http://google.com');
    expect(test.href).to.be.a('string');
    expect(test.href).to.match(/(?:webmanajemen)/);
    expect(test.internal).to.be.false;
  });
  it('check internal link', () => {
    const test = filter_external_links('http://webmanajemen.com');
    expect(test.href).to.be.a('string');
    expect(test.href).to.match(/(?:webmanajemen)/);
    expect(test.internal).to.be.true;
  });
  it('check invalid link', () => {
    const test = filter_external_links('http://webmanajemen.com">invalid');
    expect(test.href).to.be.a('string');
    expect(test.href).to.match(/(?:webmanajemen)/);
    expect(test.internal).to.be.true;
  });
});
