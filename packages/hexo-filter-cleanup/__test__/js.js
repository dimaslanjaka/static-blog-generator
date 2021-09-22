const uglifyJS = require("uglify-js");
const fs = require("fs");
const Terser = require("terser");
const jsfile = fs.readFileSync("./js-test.js").toString();
const options = {};
const result = uglifyJS.minify(jsfile, options);
(async function () {
  const resultTerser = await Terser.minify(jsfile, {
    parse: {
      ecma: 8,
    },
    compress: {
      ecma: 5,
      warnings: false,
      arrows: false,
      collapse_vars: false,
      comparisons: false,
      computed_props: false,
      hoist_funs: false,
      hoist_props: false,
      hoist_vars: false,
      inline: false,
      loops: false,
      negate_iife: false,
      properties: false,
      reduce_funcs: false,
      reduce_vars: false,
      switches: false,
      toplevel: false,
      typeofs: false,
      booleans: true,
      if_return: true,
      sequences: true,
      unused: true,
      conditionals: true,
      dead_code: true,
      evaluate: true,
    },
    mangle: {
      safari10: true,
    },
    output: {
      ecma: 5,
      comments: false,
      ascii_only: true,
    },
  });

  console.log(resultTerser);
})();

//console.log("[uglifyJS]");
//console.log(result);
//console.log("\n");
