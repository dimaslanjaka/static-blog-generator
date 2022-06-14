import { expect } from 'chai';
import 'mocha';
import { filter_external_links } from './generate-after';

describe('Test Safelink', async () => {
  // the tests container
  it('check internal link', () => {
    const test = filter_external_links('http://webmanajemen.com');
    expect(test.href).to.be.a('string');
    expect(test.href).to.match(/(?:webmanajemen)/);
    expect(test.internal).to.be.true;
  });
});
