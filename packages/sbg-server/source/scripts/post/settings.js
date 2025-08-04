import axios from 'axios';
import CodeMirror from 'codemirror';
import 'codemirror/addon/mode/overlay';
import 'codemirror/mode/gfm/gfm';
import 'codemirror/mode/markdown/markdown';
import 'codemirror/mode/yaml-frontmatter/yaml-frontmatter';
import 'codemirror/mode/yaml/yaml';
import yaml from 'yaml';
import TToast from '../../libs/helper/toast';

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
  let metadata = editor.getValue();
  const pageData = JSON.parse(document.getElementById('post-data').textContent);

  try {
    metadata = yaml.parse(metadata);
    // re-assign meta id and wordcount
    metadata.id = pageData.id;
    metadata.wordcount = pageData.wordcount;

    const options = {
      url: '/post/save',
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json;charset=UTF-8'
      },
      data: {
        metadata,
        id: pageData.id
      }
    };

    axios(options)
      .then((response) => {
        console.info(response.status);
        if (response.data.error) {
          new TToast('danger', response.data.message);
        } else {
          new TToast('success', response.data.message, 3000);
        }
      })
      .catch(console.error);
  } catch {
    //
  }
}
