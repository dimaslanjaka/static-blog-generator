import nodegit from 'nodegit';
import path from 'path';

/**
 * get status git
 * @param gitDir path location to `.git` folder
 */
export default async function gitGetStatus(
  gitDir = path.resolve(process.cwd(), '.git')
) {
  const repo = await nodegit.Repository.open(gitDir);
  const statuses = await repo.getStatus();

  const results: string[] = [];
  statuses.forEach(function (file) {
    results.push(file.path() + ' ' + statusToText(file));
  });
  return results;
}

function statusToText(status: nodegit.StatusFile) {
  const words = [];
  if (status.isNew()) {
    words.push('NEW');
  }
  if (status.isModified()) {
    words.push('MODIFIED');
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
