import hljs from 'highlight.js';
import { Extension, runtime } from 'nunjucks';

export function HighlightJsExtension() {
  this.tags = ['highlightjs'];

  this.parse = function (
    parser: Parameters<Extension['parse']>[0],
    nodes: Parameters<Extension['parse']>[1]
  ) {
    const tok = parser.nextToken(); // Get the tag token

    // Parse the args and move after the block end.
    const args = parser.parseSignature(null, true);
    parser.advanceAfterBlockEnd(tok.value);

    // Parse the body
    const body = parser.parseUntilBlocks('highlightjs', 'endhighlightjs');
    parser.advanceAfterBlockEnd();

    // Actually do work on block body and arguments
    return new nodes.CallExtension(this, 'run', args, [body]);
  };

  this.run = function (
    _context: any,
    language: string,
    bodyCallback: () => any
  ) {
    const rawCode = bodyCallback();
    const code = hljs.highlightAuto(rawCode, [language]);
    const html = `<pre><code class="hljs language-${language.toLowerCase()}">${
      code.value
    }</code></pre>`;
    return new runtime.SafeString(html);
  };
}
