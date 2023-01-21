const Arborist = require('@npmcli/arborist');
const packlist = require('npm-packlist');
const tar = require('tar');
const path = require('upath');
const packageDir = path.join(__dirname, 'packages');
const packageTarball = path.join(__dirname, 'release/static-blog-generator.tgz');

const arborist = new Arborist({ path: packageDir });
arborist.loadActual().then((tree) => {
  packlist(tree)
    .then((files) =>
      tar.create(
        {
          prefix: 'package/',
          cwd: packageDir,
          file: packageTarball,
          gzip: true
        },
        files
      )
    )
    .then((_) => {
      // tarball has been created, continue with your day
    });
});
