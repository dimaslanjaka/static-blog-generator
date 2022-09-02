const { spawn } = require('child_process');
const { join } = require('upath');

/**
 * command bin runner
 * @param {string[]} cmds
 */
function spawnerBin(cmds) {
  const commands = cmds
    .split('\n')
    .map((str) => {
      return str.split(' ').map((str) => {
        return str.trim();
      });
    })
    .filter((commands) => commands.length > 1);
  //console.log(commands);

  (function run() {
    if (!commands.length) return;
    const args = [].concat(commands[0]);
    let cmd = args[0];
    if (cmd === 'npm') cmd = /^win/.test(process.platform) ? 'npm.cmd' : 'npm';
    args.shift();
    try {
      const child = spawn(cmd, args, {
        cwd: join(__dirname, '../'),
        stdio: 'inherit'
      });
      child.once('close', () => {
        commands.shift();
        run();
      });
      child.on('error', function (e) {
        if (e instanceof Error) {
          console.log(e.message, cmd, args);
        }
      });
    } catch (e) {
      if (e instanceof Error) {
        console.log(e.message);
        console.log(commands[0]);
      }
    }
  })();
}
module.exports = spawnerBin;
