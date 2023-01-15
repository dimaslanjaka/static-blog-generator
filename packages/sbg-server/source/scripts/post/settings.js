import CodeMirror from 'codemirror';
import 'codemirror/addon/mode/overlay';
import 'codemirror/mode/gfm/gfm';
import 'codemirror/mode/markdown/markdown';
import 'codemirror/mode/yaml-frontmatter/yaml-frontmatter';
import 'codemirror/mode/yaml/yaml';
// import hljs from 'highlight.js';

console.log('post metadata settings');

const editor = CodeMirror(document.getElementById('editor'), {
  mode: 'yaml-frontmatter',
  theme: 'monokai',
  tabSize: 2,
  lineNumbers: true,
  lineWrapping: true,
  value: 'Loading...',
  extraKeys: {
    F11: function (cm) {
      cm.setOption('fullScreen', !cm.getOption('fullScreen'));
    },
    Esc: function (cm) {
      if (cm.getOption('fullScreen')) cm.setOption('fullScreen', false);
    },
    'Ctrl-S': function (_cm) {
      submitForm();
    }
  }
});
editor.on('contextmenu', function (cm, e) {
  console.log(e);
});
function submitForm() {
  //
}
