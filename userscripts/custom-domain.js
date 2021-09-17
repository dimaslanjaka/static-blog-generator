const fs = require("fs");
const path = require("path");
const prodFolder = path.join(__dirname, "../docs");
if (!fs.existsSync(prodFolder)) fs.mkdirSync(prodFolder);
console.log("Add CNAME");
fs.writeFileSync(path.join(prodFolder, "CNAME"), "git.webmanajemen.com");
