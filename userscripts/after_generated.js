const fs = require("fs");
const path = require("path");
const _ = require("lodash");
const replaceall = function (replaceThis, withThis, inThis) {
  withThis = withThis.replace(/\$/g, "$$$$");
  return inThis.replace(
    new RegExp(
      replaceThis.replace(
        /([\/\,\!\\\^\$\{\}\[\]\(\)\.\*\+\?\|<>\-\&])/g,
        "\\$&"
      ),
      "g"
    ),
    withThis
  );
};

// process docs/assets/js/quiz.js
let quizjs = path.join(__dirname, "/../docs/assets/js/quiz.js");
let read = fs.readFileSync(quizjs).toString();
let regex = /\#uniqid\(\)/gm;
let uuid = _.uniqueId();
if (typeof read.replaceAll == "function") {
  read.replaceAll(regex, uuid);
} else {
  read = replaceAll(regex, uuid, read);
}
fs.writeFileSync(quizjs, read);
