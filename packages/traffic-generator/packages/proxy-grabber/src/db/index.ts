import { join } from 'path';
import { JsonDB } from 'node-json-db';
import { Config } from 'node-json-db/dist/lib/JsonDBConfig';
import * as fm from '../../../../../hexo-seo/src/fm';
//https://www.npmjs.com/package/node-json-db
export const getNodeVersion = parseInt(process.version.toLowerCase().replace('v', ''));

function loadDb(dbfilename = 'db') {
  // Use JSON file for storage
  const file = fm.resolveFile(join(__dirname, '../../databases/' + dbfilename + '.json'));
  const db = new JsonDB(new Config(file, true, false, '/'));

  return db;
}

export default loadDb;
