import { expect } from 'chai';
import 'mocha';
import { toHtmlTest } from './toHtml.test';

describe('Test Render', async () => {
  const test = await toHtmlTest();
  // the tests container
  it('checking render markdown result', () => {
    expect(test.render).to.be.a('string');
    expect(test.parse).to.be.a('object');
  });
});
