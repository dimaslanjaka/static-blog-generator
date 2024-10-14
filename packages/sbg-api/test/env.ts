import fs from 'fs-extra';
import path from 'upath';

const paths = ['/../../../test', '/../../../../static-blog-generator-hexo/site', '/../../../../hexo-themes'];

let testCwd = paths.map((p) => path.resolve(__dirname + p)).find((resolvedPath) => fs.existsSync(resolvedPath)) as string;

export const fixturesCwd = path.resolve(__dirname, 'fixtures');
export { testCwd };
