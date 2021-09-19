const fs = require("fs");
const path = require("path");
const _ = require("lodash");
const replaceAll = function (find, replace, str) {
  var find = find.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&");
  return str.replace(new RegExp(find, "g"), replace);
};

// process docs/assets/js/quiz.js
//let read = fs.readFileSync(path.join(__dirname, "/../docs/assets/js/quiz.js")).toString();
//read = replaceAll(/\#uniqid\(\)/gm, _.uniqueId("uuid="), read);
