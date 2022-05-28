import Bluebird from 'bluebird';
import { bold, cyan, magenta, red } from 'chalk';
import nunjucks from 'nunjucks';
import stripIndent from 'strip-indent';
import { FunctionType } from '../../parser/utility';

// source: https://github.com/hexojs/hexo/blob/11b145c6c4aacbb69b4c10d49245090dd1db6375/lib/extend/tag.js
// usage: https://github.com/hexojs/hexo/blob/ed0f239c967f35fa709581b7ec74fced5f1b5a1d/lib/plugins/tag/index.js

const rSwigRawFullBlock = /{% *raw *%}/;
const rCodeTag = /<code[^<>]*>[\s\S]+?<\/code>/g;
const escapeSwigTag = (str: string) =>
  str.replace(/{/g, '&#123;').replace(/}/g, '&#125;');

class NunjucksTag /*implements nunjucks.Extension*/ {
  fn: FunctionType;
  tags: string[];
  constructor(name: string, fn: FunctionType) {
    this.tags = [name];
    this.fn = fn;
  }

  parse(parser: any, nodes: any, lexer: any) {
    const node = this._parseArgs(parser, nodes, lexer);

    return new nodes.CallExtension(this, 'run', node, []);
  }

  _parseArgs(parser: any, nodes: any, lexer: any) {
    const tag = parser.nextToken();
    const node = new nodes.NodeList(tag.lineno, tag.colno);
    const argarray = new nodes.Array(tag.lineno, tag.colno);

    let token: { type: any; value: string };
    let argitem = '';

    while ((token = parser.nextToken(true))) {
      if (
        token.type === lexer.TOKEN_WHITESPACE ||
        token.type === lexer.TOKEN_BLOCK_END
      ) {
        if (argitem !== '') {
          const argnode = new nodes.Literal(
            tag.lineno,
            tag.colno,
            argitem.trim()
          );
          argarray.addChild(argnode);
          argitem = '';
        }

        if (token.type === lexer.TOKEN_BLOCK_END) {
          break;
        }
      } else {
        argitem += token.value;
      }
    }

    node.addChild(argarray);

    return node;
  }

  run(context: any, args: any, _body?: any, _callback?: FunctionType) {
    return this._run(context, args, '');
  }

  _run(context: any, args: any, body: string) {
    return Reflect.apply(this.fn, context.ctx, [args, body]);
  }
}

const trimBody = (body) => {
  return stripIndent(body()).replace(/^\n?|\n?$/g, '');
};

class NunjucksBlock extends NunjucksTag {
  parse(parser: any, nodes: any, lexer: any) {
    const node = this._parseArgs(parser, nodes, lexer);
    const body = this._parseBody(parser, nodes, lexer);

    return new nodes.CallExtension(this, 'run', node, [body]);
  }

  _parseBody(parser: any, _nodes: any, _lexer: any) {
    const body = parser.parseUntilBlocks(`end${this.tags[0]}`);

    parser.advanceAfterBlockEnd();
    return body;
  }

  run(context: any, args: any, body: any, _callback?: FunctionType) {
    return this._run(context, args, trimBody(body));
  }
}

class NunjucksAsyncTag extends NunjucksTag {
  parse(parser: any, nodes: any, lexer: any) {
    const node = this._parseArgs(parser, nodes, lexer);

    return new nodes.CallExtensionAsync(this, 'run', node, []);
  }

  run(context: any, args: any, callback: FunctionType) {
    return this._run(context, args, '').then((result: any) => {
      callback(null, result);
    }, callback);
  }
}

class NunjucksAsyncBlock extends NunjucksBlock {
  parse(parser: any, nodes: any, lexer: any) {
    const node = this._parseArgs(parser, nodes, lexer);
    const body = this._parseBody(parser, nodes, lexer);

    return new nodes.CallExtensionAsync(this, 'run', node, [body]);
  }

  run(context: any, args: any, body: FunctionType, callback: FunctionType) {
    // enable async tag nesting
    body((err: any, result: any) => {
      // wrapper for trimBody expecting
      // body to be a function
      body = () => result || '';

      this._run(context, args, trimBody(body)).then((result) => {
        callback(err, result);
      });
    });
  }
}

export class Tag {
  env: nunjucks.Environment;
  constructor() {
    this.env = new nunjucks.Environment(null, {
      autoescape: false
    });
  }

  register(
    name: string,
    fn: string | any[] | FunctionType,
    options: { async?: any; ends: any }
  ) {
    if (!name) throw new TypeError('name is required');
    if (typeof fn !== 'function') throw new TypeError('fn must be a function');

    if (options == null || typeof options === 'boolean') {
      options = { ends: options };
    }

    let tag: nunjucks.Extension;

    if (options.async) {
      if (fn.length > 2) {
        fn = Bluebird.promisify(fn);
      } else {
        fn = Bluebird.method(fn);
      }

      if (options.ends) {
        tag = new NunjucksAsyncBlock(name, fn);
      } else {
        tag = new NunjucksAsyncTag(name, fn);
      }
    } else if (options.ends) {
      tag = new NunjucksBlock(name, fn);
    } else {
      tag = new NunjucksTag(name, fn);
    }

    this.env.addExtension(name, tag);
  }

  unregister(name: string) {
    if (!name) throw new TypeError('name is required');

    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const { env } = this;

    if (env.hasExtension(name)) env.removeExtension(name);
  }

  render(str: string, options = { source: '' }, callback: any) {
    if (!callback && typeof options === 'function') {
      callback = options;
      options = { source: '' };
    }

    // Get path of post from source
    const { source = '' } = options;

    return Bluebird.fromCallback((cb) => {
      this.env.renderString(
        str.replace(rCodeTag, (s) => {
          // https://hexo.io/docs/tag-plugins#Raw
          // https://mozilla.github.io/nunjucks/templating.html#raw
          // Only escape code block when there is no raw tag included
          return s.match(rSwigRawFullBlock) ? s : escapeSwigTag(s);
        }),
        options,
        cb
      );
    })
      .catch((err) => Bluebird.reject(formatNunjucksError(err, str, source)))
      .asCallback(callback);
  }
}

// env.addExtension('code', new Tag());

/**
 * Provide context for Nunjucks error
 * @param  {Error}    err Nunjucks error
 * @param  {string}   input string input for Nunjucks
 * @return {Error}    New error object with embedded context
 */
export const formatNunjucksError = (
  err: Error,
  input: string,
  source = ''
): Error => {
  const match = err.message.match(/Line (\d+), Column \d+/);
  if (!match) return err;
  const errLine = parseInt(match[1], 10);
  if (isNaN(errLine)) return err;

  // trim useless info from Nunjucks Error
  const splited = err.message
    .replace('(unknown path)', source ? magenta(source) : '')
    .split('\n');

  const e = new Error();
  e.name = 'Nunjucks Error';
  e['line'] = errLine;
  e['location'] = splited[0];
  e['type'] = splited[1].trim();
  e.message = getContext(
    input.split(/\r?\n/),
    errLine,
    e['location'],
    e['type']
  ).join('\n');
  return e;
};

const getContextLineNums = (
  min: number,
  max: number,
  center: number,
  amplitude: number
) => {
  const result = [];
  let lbound = Math.max(min, center - amplitude);
  const hbound = Math.min(max, center + amplitude);
  while (lbound <= hbound) result.push(lbound++);
  return result;
};

const LINES_OF_CONTEXT = 5;

const getContext = (
  lines: string | any[],
  errLine: number,
  location: string,
  type: unknown
) => {
  const message = [
    location + ' ' + red(type),
    cyan('    =====               Context Dump               ====='),
    cyan('    === (line number probably different from source) ===')
  ];

  message.push(
    // get LINES_OF_CONTEXT lines surrounding `errLine`
    ...getContextLineNums(1, lines.length, errLine, LINES_OF_CONTEXT).map(
      (lnNum) => {
        const line = '  ' + lnNum + ' | ' + lines[lnNum - 1];
        if (lnNum === errLine) {
          return cyan(bold(line));
        }

        return cyan(line);
      }
    )
  );
  message.push(
    cyan('    =====             Context Dump Ends            =====')
  );

  return message;
};
