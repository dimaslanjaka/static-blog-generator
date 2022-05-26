'use strict';

// source: https://github.com/hexojs/hexo/blob/ba81258b5b6a1a7ae02033c056d82198c6d92ec9/lib/plugins/tag/code.js
// Based on: https://raw.github.com/imathis/octopress/master/plugins/code_block.rb

import hexoUtil, { escapeHTML } from 'hexo-util';
import { FunctionType } from '../../../parser/utility';
import { default_project_config } from '../../../types/_config';

// Lazy require highlight.js & prismjs
let highlight: FunctionType<string>, prismHighlight: FunctionType<string>;

const rCaptionUrlTitle = /(\S[\S\s]*)\s+(https?:\/\/\S+)\s+(.+)/i;
const rCaptionUrl = /(\S[\S\s]*)\s+(https?:\/\/\S+)/i;
const rCaption = /\S[\S\s]*/;

/**
 * @param {String} title Caption text
 * @param {Object} lang Specify language
 * @param {String} url Source link
 * @param {String} link_text Text of the link
 * @param {Object} line_number Show line number, value must be a boolean
 * @param {Object} highlight Enable code highlighting, value must be a boolean
 * @param {Object} first_line Specify the first line number, value must be a number
 * @param {Object} mark Line highlight specific line(s), each value separated by a comma. Specify number range using a dash
 * Example: `mark:1,4-7,10` will mark line 1, 4 to 7 and 10.
 * @param {Object} wrap Wrap the code block in <table>, value must be a boolean
 * @returns {String} Code snippet with code highlighting
 */

/**
 * arg parser
 * @param args
 * @returns
 */
//parseArgs
export function parseCodeblockArgs(args: string | any[]) {
  const _else = [];
  const len = args.length;
  let lang: string, line_number: boolean, line_threshold: number, wrap: boolean;
  let firstLine = 1;
  const mark = [];
  for (let i = 0; i < len; i++) {
    const colon = args[i].indexOf(':');

    if (colon === -1) {
      _else.push(args[i]);
      continue;
    }

    const key = args[i].slice(0, colon);
    const value = args[i].slice(colon + 1);

    switch (key) {
      case 'lang':
        lang = value;
        break;
      case 'line_number':
        line_number = value === 'true';
        break;
      case 'line_threshold':
        if (!isNaN(value)) line_threshold = +value;
        break;
      case 'first_line':
        if (!isNaN(value)) firstLine = +value;
        break;
      case 'wrap':
        wrap = value === 'true';
        break;
      case 'mark': {
        for (const cur of value.split(',')) {
          const hyphen = cur.indexOf('-');
          if (hyphen !== -1) {
            let a = +cur.slice(0, hyphen);
            let b = +cur.slice(hyphen + 1);
            if (Number.isNaN(a) || Number.isNaN(b)) continue;
            if (b < a) {
              // switch a & b
              const temp = a;
              a = b;
              b = temp;
            }

            for (; a <= b; a++) {
              mark.push(a);
            }
          }
          if (!isNaN(cur)) mark.push(+cur);
        }
        break;
      }
      default: {
        _else.push(args[i]);
      }
    }
  }

  const arg = _else.join(' ');
  // eslint-disable-next-line one-var
  let match: any[],
    caption = '';

  if ((match = arg.match(rCaptionUrlTitle)) != null) {
    caption = `<span>${match[1]}</span><a href="${match[2]}">${match[3]}</a>`;
  } else if ((match = arg.match(rCaptionUrl)) != null) {
    caption = `<span>${match[1]}</span><a href="${match[2]}">link</a>`;
  } else if ((match = arg.match(rCaption)) != null) {
    caption = `<span>${match[0]}</span>`;
  }

  return {
    lang,
    firstLine,
    caption,
    line_number,
    line_threshold,
    mark,
    wrap
  };
}

/**
 * Code block tag
 * @example
 * {% codeblock [options] %}
 * code snippet
 * {% endcodeblock %}
 * @param ctx
 * @returns
 */
export const codeblock = (ctx: {
  config: {
    highlight: Partial<typeof default_project_config.highlight>;
    prismjs: Partial<typeof default_project_config.highlight>;
  };
}) =>
  function codeTag(args: string | any[], content: string) {
    const hljsCfg: typeof ctx.config.highlight = ctx.config.highlight || {};
    const prismjsCfg: typeof ctx.config.prismjs = ctx.config.prismjs || {};

    // If neither highlight.js nor prism.js is enabled, return escaped code directly
    if (!hljsCfg.enable && !prismjsCfg.enable) {
      return `<pre><code>${escapeHTML(content)}</code></pre>`;
    }

    let index: string | number;
    let enableHighlight = true;

    if (
      Array.isArray(args) &&
      (index = args.findIndex((item) => item.startsWith('highlight:'))) !== -1
    ) {
      const arg = args[index];
      const highlightStr = arg.slice(10);
      enableHighlight = highlightStr === 'true';
      args.splice(index, 1);
    }

    // If 'highlight: false' is given, return escaped code directly
    if (!enableHighlight) {
      return `<pre><code>${escapeHTML(content)}</code></pre>`;
    }

    const {
      lang,
      firstLine,
      caption,
      line_number,
      line_threshold,
      mark,
      wrap
    } = parseCodeblockArgs(args);

    if (prismjsCfg.enable) {
      const shouldUseLineNumbers =
        typeof line_number !== 'undefined'
          ? line_number
          : prismjsCfg.line_number;
      let surpassesLineThreshold: boolean;

      if (typeof line_threshold !== 'undefined') {
        surpassesLineThreshold = content.split('\n').length > line_threshold;
      } else {
        surpassesLineThreshold =
          content.split('\n').length > (prismjsCfg['line_threshold'] || 0);
      }

      const prismjsOption = {
        lang,
        firstLine,
        caption,
        lineNumber: shouldUseLineNumbers && surpassesLineThreshold,
        mark,
        tab: prismjsCfg.tab_replace,
        isPreprocess: prismjsCfg['preprocess']
      };

      if (!prismHighlight) prismHighlight = hexoUtil['prismHighlight'];

      content = prismHighlight(content, prismjsOption);
    } else {
      const shouldUseLineNumbers =
        typeof line_number !== 'undefined' ? line_number : hljsCfg.line_number;
      let surpassesLineThreshold: boolean;

      if (typeof line_threshold !== 'undefined') {
        surpassesLineThreshold = content.split('\n').length > line_threshold;
      } else {
        surpassesLineThreshold =
          content.split('\n').length > (hljsCfg['line_threshold'] || 0);
      }

      const hljsOption = {
        lang: typeof lang !== 'undefined' ? lang : '',
        firstLine,
        caption,
        gutter: shouldUseLineNumbers && surpassesLineThreshold,
        hljs: hljsCfg.hljs,
        mark,
        tab: hljsCfg.tab_replace,
        autoDetect: hljsCfg.auto_detect,
        wrap: typeof wrap === 'boolean' ? wrap : hljsCfg.wrap
      };

      if (!highlight) highlight = hexoUtil.highlight;

      content = highlight(content, hljsOption);
    }

    return content.replace(/{/g, '&#123;').replace(/}/g, '&#125;');
  };
