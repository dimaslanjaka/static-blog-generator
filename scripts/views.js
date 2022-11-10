/* global hexo */

'use strict';

const fs = require('fs');
const path = require('path');
const injector = require('hexo-extend-injector2')(hexo);

// gitter
// injector.register('body-end', `<script>
// ((window.gitter = {}).chat = {}).options = {
//   room: 'jiangtj/Lobby',
//   activationElement: false
// };
// </script>`);
// injector.register('body-end', '<script src="https://sidecar.gitter.im/dist/sidecar.v1.js" async defer></script>');
// injector.register('js', path.resolve(hexo.base_dir, 'views/gitter.js'));

injector.register('head_end', '<script data-ad-client="ca-pub-8243423215749776" async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"></script>');
injector.register('head_end', fs.readFileSync(path.resolve(hexo.base_dir, 'views/head.html'), 'utf8'));
injector.register('body-end', fs.readFileSync(path.resolve(hexo.base_dir, 'views/baidu-push.html'), 'utf8'));
// injector.sidebar.file('custom', 'views/sidebar.swig', {}, {cache: true});
// injector.bodyEnd.file('baidu-push', 'views/baidu-push.swig', {}, {cache: true});

injector.register('variable', 'source/_data/variables.styl');
injector.register('style', 'source/_data/styles.styl');

// injects.style.push('views/gitter.styl');

