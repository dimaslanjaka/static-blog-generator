import { expect } from 'chai';
import 'mocha';
import { toHtmlTest } from './toHtml.test';

describe('Test Render', () => {
  // the tests container
  it('checking render markdown result', async () => {
    const test = await toHtmlTest();
    expect(test.render).to.be.a('string');
    expect(test.parse).to.be.a('object');
    expect(test.parse).to.not.be.null;
  });
});
