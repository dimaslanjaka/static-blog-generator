/* eslint-disable @typescript-eslint/no-this-alias */
import nunjucks from 'nunjucks';
import { codeblock2 } from './tags/codeblock2';
import { HighlightJsExtension } from './tags/highlight';

const str = `
{% codeblock Array.map %}
array.map(callback[, thisArg])
{% endcodeblock %}
`;

const env = new nunjucks.Environment(null, {
  autoescape: false
});
env.addExtension('HighlightJsExtension', new HighlightJsExtension());
env.addExtension('codeblock', new codeblock2());

const compiler = nunjucks.compile(str, env);
const rendered = compiler.render();
console.log(rendered);
