import CodeMirror from 'codemirror';
import 'codemirror/mode/yaml-frontmatter/yaml-frontmatter';
// import hljs from 'highlight.js';

let editor = CodeMirror(document.querySelector('#editor'), {
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
    'Ctrl-S': function (_editor) {
      submitForm();
    }
  }
});

const defv = document.querySelector('#default-value');
editor.setValue(defv.textContent);

function submitForm() {
  //
}
