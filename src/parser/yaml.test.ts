import { readFileSync } from 'fs';
import { join } from 'path';
import yaml from 'yaml';

// try parsing and restore yaml with comments
const yamlfile = join(__dirname, 'yaml.yml');
const parse = yaml.parseAllDocuments(readFileSync(yamlfile, 'utf-8'));
console.log(parse);
