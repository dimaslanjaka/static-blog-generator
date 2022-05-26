import nunjucks from 'nunjucks';
import { FunctionType } from '../../../parser/utility';
import { project_config } from '../../../types/_config';
import { codeblock } from './codeblock';
export class codeblock2 implements nunjucks.Extension {
  tags: string[] = ['codeblock'];
  parse(parser: any, nodes: any, _lexer: any) {
    const tok = parser.nextToken(); // Get the tag token

    // Parse the args and move after the block end.
    const args = parser.parseSignature(null, true);
    parser.advanceAfterBlockEnd(tok.value);

    // Parse the body
    const body = parser.parseUntilBlocks('codeblock', 'endcodeblock');
    parser.advanceAfterBlockEnd();

    // Actually do work on block body and arguments
    return new nodes.CallExtension(this, 'run', args, [body]);
  }

  run(_context: any, args: any, bodyCallback: FunctionType) {
    const rawCode = bodyCallback();
    console.log(args);
    //return new nunjucks.runtime.SafeString(html);
    const _init = codeblock({
      config: {
        highlight: project_config.highlight,
        prismjs: project_config.prismjs
      }
    });
    return rawCode;
  }
}
