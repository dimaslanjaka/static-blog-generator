import { expect } from 'chai';
import 'mocha';
import { postMap } from '../../../parser/post/parsePost';
import { copyPosts } from './posts';

function doStuff(obj: { parse: postMap; file: string; saveTo: string }) {
  console.log(obj.saveTo);
  expect(obj.saveTo).to.be.an('string');
}

describe('run copy test', async function () {
  const unitTests = await copyPosts(null);
  unitTests.forEach(function (obj) {
    it('does stuff with ' + obj.parse.metadata.title, function (done) {
      doStuff.apply(null, [obj]);
      done();
    });
  });
});
