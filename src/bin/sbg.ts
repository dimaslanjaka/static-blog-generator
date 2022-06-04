#!/usr/bin/env node

import yargs from 'yargs';
import { getConfig } from '../types/_config';

const argv = yargs(process.argv.slice(2)).argv;
const tasks = argv['_'];

console.log(getConfig().verbose, getConfig().generator.cache);
