/* global markdownit, CodeMirror, hljs */

(function () {
  'use strict';
})();

require.ensure([], function () {
  window.require = function (module) {
    return require(module);
  };
});

export default function edit() {
  let md = markdownit({
    html: true, // Enable HTML tags in source
    xhtmlOut: true, // Use '/' to close single tags (<br />).
    // This is only for full CommonMark compatibility.
    breaks: false, // Convert '\n' in paragraphs into <br>
    langPrefix: 'language-', // CSS language prefix for fenced blocks. Can be
    // useful for external highlighters.
    linkify: false, // Autoconvert URL-like text to links

    // Enable some language-neutral replacement + quotes beautification
    typographer: false,

    // Double + single quotes replacement pairs, when typographer enabled,
    // and smartquotes on. Could be either a String or an Array.
    //
    // For example, you can use '«»„“' for Russian, '„“‚‘' for German,
    // and ['«\xA0', '\xA0»', '‹\xA0', '\xA0›'] for French (including nbsp).
    quotes: '“”‘’',

    // Highlighter function. Should return escaped HTML,
    // or '' if the source string is not changed and should be escaped externaly.
    // If result starts with <pre... internal wrapper is skipped.
    highlight(str, info) {
      let [lang, start, end] = info.split(':');
      let open = `<pre class="hljs" data-line-start="${start}" data-line-end="${end}"><code>`;
      let close = '</code></pre>';

      if (lang && hljs.getLanguage(lang)) {
        try {
          return open + hljs.highlight(lang, str, true).value + close;
        } catch (__) {
          //
        }
      }

      return open + md.utils.escapeHtml(str) + close;
    }
  });

  md.core.ruler.push('line', (state) => {
    state.tokens.map((token) => {
      if (token.map) {
        let [start, end] = token.map;

        token.attrSet('data-line-start', start);
        token.attrSet('data-line-end', end);

        if (token.type === 'fence') {
          token.info += `:${start}:${end}`;
        }
      }

      return token;
    });

    return state;
  });

  let editor = CodeMirror(document.querySelector('#editor'), {
    mode: 'markdown',
    theme: 'monokai',
    tabSize: 2,
    lineNumbers: true,
    lineWrapping: true,
    value: 'Loading...'
  });

  let ignoreEvent = false;

  editor.on('change', (editor, _diff) => {
    document.querySelector('#preview').innerHTML = md.render(editor.getValue());
  });

  editor.on('scroll', (editor) => {
    if (ignoreEvent) {
      return;
    }

    ignoreEvent = true;

    let scrollTop = editor.getScrollInfo().top / 100;
    let line = editor.lineAtHeight(scrollTop);
    let el = null;

    while (!el) {
      if (window.CP.shouldStopExecution(0)) break;
      el = document.querySelector(`#preview *[data-line-start="${line--}"]`);
    }
    window.CP.exitedLoop(0);

    let lineStart = +el.dataset.lineStart;
    let lineEnd = +el.dataset.lineEnd;
    let lineStartTop = editor.heightAtLine(lineStart);
    let lineEndBottom = editor.heightAtLine(lineEnd + 1) - 1;
    let lineHeight = lineEndBottom - lineStartTop;
    let ratio = (scrollTop - lineStartTop) / lineHeight;

    let preview = document.querySelector('#preview');
    let rect = el.getBoundingClientRect();
    let style = window.getComputedStyle(el);
    let margin = parseInt(style.marginTop) + parseInt(style.marginBottom);
    let elTop = preview.scrollTop + rect.top;
    let elHeight = margin + rect.height;
    let scrollTo = Math.max(0, elTop + elHeight * ratio);

    preview.scrollTop = scrollTo;

    setTimeout(() => {
      ignoreEvent = false;
    });
  });

  document.querySelector('#preview').addEventListener('scroll', (_e) => {
    if (ignoreEvent) {
      return;
    }

    ignoreEvent = true;

    let el, prev;

    for (let dom of document.querySelectorAll('#preview > *')) {
      if (dom.getBoundingClientRect().top > 0) {
        el = prev || dom;

        break;
      }

      prev = dom;
    }

    let rect = el.getBoundingClientRect();
    let style = window.getComputedStyle(el);
    let margin = parseInt(style.marginTop) + parseInt(style.marginBottom);
    let elHeight = margin + rect.height;
    let ratio = 1 - (elHeight + rect.top) / elHeight;

    let lineStart = +el.dataset.lineStart;
    let lineEnd = +el.dataset.lineEnd;
    let lineStartTop = editor.heightAtLine(lineStart);
    let lineEndBottom = editor.heightAtLine(lineEnd + 1) - 1;
    let lineHeight = lineEndBottom - lineStartTop;

    let scrollTo =
      editor.getScrollInfo().top + lineStartTop + lineHeight * ratio;

    editor.scrollTo(null, scrollTo);

    setTimeout(() => {
      ignoreEvent = false;
    });
  });

  editor.setValue(document.querySelector('#default-value').innerHTML);
}

if (typeof window === 'object') {
  window.edit = edit;
}

module.exports = {
  run: edit
};
