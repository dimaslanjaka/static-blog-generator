const { exec } = require("child_process");

console.log("install global dependencies");
exec("npm i -g npm gulp-cli typescript ts-node", (err, stdout, stderr) => {
  if (!err) {
    console.log("npm install");
    exec("npm install", (err, stdout, stderr) => {
      if (!err) {
        console.log("gulp article:copy");
        exec("npx gulp article:copy", (err, stdout, stderr) => {
          if (!err) {
            console.log("hexo generate");
            exec("hexo generate", (err, stdout, stderr) => {});
          }
        });
      }
    });
  }
});
