import * as fs from 'fs';
import * as path from 'upath';
import { spawn } from 'child_process';

export function beforeDeploy (cwd:string) {
  const pkg = path.join(cwd, 'package.json');
  if (fs.existsSync(pkg)) spawn('npm', ['install', '--production', '--omit=dev'], {cwd});
}
