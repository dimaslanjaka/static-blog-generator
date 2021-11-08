const execSys = require("child_process").exec;

exec("npm i -g npm hexo-cli gulp-cli typescript ts-node", (err, stdout, stderr) => {
  if (!err) {
    exec("npm install", (err, stdout, stderr) => {
      if (!err) {
        exec("npm i ./packages/hexo-filter-cleanup", (err) => {
          if (!err) {
            exec("npx gulp article:copy", (err, stdout, stderr) => {
              if (!err) {
                exec("hexo generate", (err, stdout, stderr) => {});
              }
            });
          }
        });
      }
    });
  }
});

/**
 * Shadow exec
 * @param {string} cmd
 * @param {(err: Error, stdout: string, stderr: string)} callback
 */
function exec(cmd, callback) {
  console.log("cmd: " + cmd);
  execSys(cmd, callback);
}
