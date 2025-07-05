import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import { fs, jsonParseWithCircularRefs, jsonStringifyWithCircularRefs, writefile } from '../../src/index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const file = join(__dirname, '../fixtures/circular.json');
const json = JSON.parse(fs.readFileSync(file, 'utf-8')) as Record<string, any>;

const circular = {
  json,
  arr: [json, json, json]
};

/** save location */
const saveto = join(__dirname, '../../tmp/circular.json');

const save = writefile(saveto, jsonStringifyWithCircularRefs(circular));

// re-parse

const parse = jsonParseWithCircularRefs(fs.readFileSync(save.file, 'utf-8')) as typeof circular;
console.log(parse.json[0]._id === '64b26da5221da4b10c86314a');
