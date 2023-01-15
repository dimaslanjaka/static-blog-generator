import axios from 'axios';
import CodeMirror from 'codemirror';
import 'codemirror/addon/mode/overlay';
import 'codemirror/mode/gfm/gfm';
import 'codemirror/mode/markdown/markdown';
import 'codemirror/mode/yaml-frontmatter/yaml-frontmatter';
import 'codemirror/mode/yaml/yaml';
import yaml from 'yaml';

console.log('post metadata settings');

const editor = CodeMirror.fromTextArea(document.getElementById('editor'), {
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

document
  .querySelector('#submit-metadata')
  .addEventListener('click', submitForm);
function submitForm(e) {
  if (e && e.preventDefault) e.preventDefault();
  const metadata = editor.getValue();
  const pageData = JSON.parse(document.getElementById('post-data').textContent);

  const options = {
    url: '/post/save',
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json;charset=UTF-8'
    },
    data: {
      metadata: yaml.parse(metadata),
      id: pageData.id
    }
  };

  axios(options)
    .then((response) => {
      console.info(response.status);
      if (response.data.error) {
        //toastr.error(response.data.message, 'Error saving metadata');
      } else {
        //toastr.success(response.data.message, 'Success saving metadata');
      }
    })
    .catch(console.error);
}
