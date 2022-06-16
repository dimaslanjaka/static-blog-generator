import { expect } from 'chai';
import 'mocha';
import config, { post_source_dir } from '../types/_config';
import { globSrc } from './filemanager';

describe('Test Copy Posts', () => {
  // the tests container
  it(`checking glob source from ${post_source_dir}`, async () => {
    const exclude = config.exclude.map((ePattern: string) =>
      ePattern.replace(/^!+/, '')
    );
    const test = await globSrc('**/*.md', {
      cwd: post_source_dir,
      ignore: exclude,
      use: 'minimatch'
    });

    expect(test).to.be.an('array').that.is.not.empty;
  });
});
