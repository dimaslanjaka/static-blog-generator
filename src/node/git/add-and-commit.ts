import nodegit from 'nodegit';
import path from 'path';
import { configDeploy } from '../../types/_config';

export default async function gitAddCommit(
  gitDir = path.resolve(process.cwd(), '.git'),
  filePath: string,
  messages: string
) {
  const repo = await nodegit.Repository.open(gitDir);
  const index = await repo.refreshIndex();
  if (filePath) {
    index.addByPath(filePath);
  } else {
    index.addAll();
  }

  // this will write both files to the index
  await index.write();

  const oid = await index.writeTree();

  const parent = await repo.getHeadCommit();

  const username = configDeploy.user || configDeploy.username || 'Foo bar';
  const author = nodegit.Signature.now(
    username,
    configDeploy.email || configDeploy.mail || 'foo@bar.com'
  );
  const committer = nodegit.Signature.now(username, username + '@github.com');

  const commitId = await repo.createCommit(
    'HEAD',
    author,
    committer,
    messages,
    oid,
    [parent]
  );

  console.log('New Commit: ', commitId);
}
