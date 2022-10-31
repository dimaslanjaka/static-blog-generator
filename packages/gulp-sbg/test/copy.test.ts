import { spawn } from 'child_process';
import { hexoProject } from '../project';

const cwd = hexoProject;

const child = spawn('npm', ['run', 'copy'], { cwd, stdio: 'inherit' });
