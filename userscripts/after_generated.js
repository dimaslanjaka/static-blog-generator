const fs = require("fs");
const path = require("path");
const _ = require("lodash");
// process docs/assets/js/quiz.js
let read = fs.readFileSync(path.join(__dirname, "/../docs/assets/js/quiz.js")).toString();
read = read.replaceAll(/\#uniqid\(\)/gm, _.uniqueId("uuid="));
