import fs from 'fs-extra';
import path from 'path';
import yaml from 'yaml';

const yml = path.join(__dirname, '.github/workflows/build-docs.yml');
const parse = yaml.parse(fs.readFileSync(yml, 'utf-8'));

console.log(parse);
