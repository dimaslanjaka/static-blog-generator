import { join } from 'path';
import prettier from 'prettier';
import { write } from '../../node/filemanager';
import fixHtmlPost from './generate-after';

const body = `
<a href="http://google.com">external</a>
<a href="http://www.webmanajemen.com">internal</a>
<a href="http://invalid.webmanajemen.com>invalid</a>
`;

const result = fixHtmlPost(body);
const pretty = prettier.format(result, { semi: false, parser: 'html' });
write(join(__dirname, 'tmp/fixHtmlPost.html'), pretty).then(console.log);
