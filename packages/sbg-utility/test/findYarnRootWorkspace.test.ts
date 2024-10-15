'use strict';

import { describe, expect, it } from '@jest/globals';
import url from 'node:url';
import path from 'path';
import findYarnRootWorkspace from '../src/utils/nodeWorkspaceHelper';

// npx c8 --reporter=lcovonly mocha --timeout=7000000 test/find-yarn-root-workspace.test.js

const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

describe('find workspace root directory', () => {
  const rootWorkspace = path.resolve(__dirname, '../../../');
  const findsFrom = [path.join(__dirname, '..'), path.join(__dirname, '../../../test')];
  for (let i = 0; i < findsFrom.length; i++) {
    const searchDir = findsFrom[i];
    it('search from ' + searchDir, () => {
      const find = findYarnRootWorkspace({ base_dir: searchDir });
      expect(find).toEqual(rootWorkspace);
    });
  }
});
