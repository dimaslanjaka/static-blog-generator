/* eslint-disable import/extensions */
/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable no-undef */

/*require("ts-node").register({
  projectSearchDir: __dirname,
  project: "tsconfig.json"
});
require("./src");*/
require("dotenv").config();
//console.log(process.env);
require("./dist/traffic-generator/src/index");
