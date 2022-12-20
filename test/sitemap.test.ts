process.cwd = () => __dirname;

import { hexoGenerateSitemap } from '../src';

hexoGenerateSitemap();
