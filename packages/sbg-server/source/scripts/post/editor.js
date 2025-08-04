// import CodeMirror from '../../libs/codemirror/lib/codemirror';
import CodeMirror from 'codemirror';

function initPostEditor() {
  const input = document.getElementById('post-editor');
  const codeMirrorEditor = CodeMirror.fromTextArea(input, {
    mode: 'markdown',
    theme: 'default',
    lineWrapping: true
  });
  let content = `{{ post.body }}`;
  codeMirrorEditor.setValue(content);
  // codeMirrorEditor.setSize('100%', height);
  setTimeout(function () {
    codeMirrorEditor.refresh();
  }, 1);
  codeMirrorEditor.on('change', () => (content = codeMirrorEditor.getValue()));
}

if (typeof window !== 'undefined') {
  window.initPostEditor = initPostEditor;
}
