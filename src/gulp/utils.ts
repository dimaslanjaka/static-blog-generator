import fs from "fs";
import path from "path";

//console.log(loopDir(path.join(process.cwd(), "source")));
/**
 * Loop dir recursive
 * @param destDir
 * @param debug
 */
export function loopDir(destDir: fs.PathLike | string, debug = false) {
  if (!fs.lstatSync(destDir).isDirectory()) {
    if (debug) console.error(destDir + " isn't folder");
    return;
  }

  let result: string[] = [];

  const readDir = fs.readdirSync(destDir);
  if (readDir) {
    if (debug) console.log(readDir.length + " files to process");
    readDir.forEach(function (file) {
      const absolute = path.join(destDir.toString(), file);
      if (fs.statSync(absolute).isDirectory()) {
        result = loopDir(absolute).concat(result);
      } else {
        result.push(absolute);
      }
    });
  }

  return result;
}
