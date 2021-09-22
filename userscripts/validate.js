// validate docs
const fs = require("fs");
const path = require("path");
const root = path.join(__dirname, "/../");
const docs = path.join(root, "docs");

let tests = [path.join(docs, "index.html")];
tests.forEach(function (test) {
  if (fs.existsSync(test)) {
    let sizes_byte = fs.statSync(test).size;
    if (sizes_byte == 0) exitMsg("File size 0");
    let content_sizes = fs.readFileSync(test).toString().trim().length;
    if (content_sizes == 0) exitMsg("File content empty");
  }
});

function exitMsg(str) {
  throw str;
  process.exit(1);
}
