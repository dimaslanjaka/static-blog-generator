'use strict';

import { describe, expect, it } from '@jest/globals';
import { join, resolve } from 'path';
import findYarnRootWorkspace from '../src/utils/findYarnRootWorkspace';

// npx c8 --reporter=lcovonly mocha --timeout=7000000 test/find-yarn-root-workspace.test.js

describe('find workspace root directory', () => {
  const rootWorkspace = resolve(__dirname, '../../../');
  const findsFrom = [join(__dirname, '..'), join(__dirname, '../../../test')];
  for (let i = 0; i < findsFrom.length; i++) {
    const searchDir = findsFrom[i];
    it('search from ' + searchDir, () => {
      const find = findYarnRootWorkspace({ base_dir: searchDir });
      expect(find).toEqual(rootWorkspace);
    });
  }
});
