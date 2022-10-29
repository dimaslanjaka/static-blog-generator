import { expect } from 'chai';
import thesaurus_main from '../src/thesaurus';

describe('Thesaurus Test', function () {
  it('should equal', async function () {
    const run = await thesaurus_main('install and activate VSCode ESLint extension for auto Linter And Formatter');
    console.log(run);
    expect(run).to.be.oneOf([
      'install and activate VSCode ESLint addition for auto Linter And Formatter',
      'install and activate VSCode ESLint plugin for auto Linter And Formatter'
    ]);
  });
});
