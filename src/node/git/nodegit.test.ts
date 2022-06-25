import nodegit from 'nodegit';
import path from 'path';
import color from '../color';

nodegit.Repository.open(path.resolve(process.cwd(), '.git')).then(function (
  repo
) {
  repo.getStatus().then(function (statuses) {
    function statusToText(status) {
      const words = [];
      if (status.isNew()) {
        words.push(color.greenBright('NEW'));
      }
      if (status.isModified()) {
        words.push(color.yellowBright('MODIFIED'));
      }
      if (status.isTypechange()) {
        words.push('TYPECHANGE');
      }
      if (status.isRenamed()) {
        words.push('RENAMED');
      }
      if (status.isIgnored()) {
        words.push('IGNORED');
      }

      return words.join(' ');
    }

    statuses.forEach(function (file) {
      console.log(file.path() + ' ' + statusToText(file));
    });
  });
});
