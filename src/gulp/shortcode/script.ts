import fs from "fs";
import path from "path";
import "../../../src/js/_Prototype-String";

/**
 * Parse shortcode script
 * ```html
 * <!-- script /path/file.js -->
 * ```
 * @param file markdown file
 * @returns
 */
export function shortcodeScript(file: string) {
  if (!fs.statSync(file).isFile()) {
    console.log("[" + file.toString().removeRoot() + "] its a directory, not a file");
    return;
  }
  const read = fs.readFileSync(file).toString();
  const matchFile = read.match(/\<\!\-\-\s+?script\s+?.+?\s+?\-\-\>/gm);
  if (matchFile && matchFile.length > 0) {
    matchFile.forEach(function (readied) {
      const match = readied.match(/\<\!\-\-\s+?script\s+?(.+?)\s+?\-\-\>/);
      //console.log("matched ", match);
      if (match && match.length > 1) {
        const directFile = path.join(path.dirname(file), match[1]);
        const directFind = fs.existsSync(directFile);
        if (directFind) {
          console.log("[direct] Processing shortcode " + directFile);
          const directRead = fs.readFileSync(directFile).toString();
          const directReplace = read.replace(match[0], `<script>${directRead}</script>`);
          fs.writeFileSync(file, directReplace);
          console.log(file.removeRoot() + " include script successfully");
        } else {
          console.error(match[1] + " not inline with " + file.removeRoot());
          const rootFind = path.join(process.cwd(), match[1]);
          if (fs.existsSync(rootFind)) {
            console.log("[root] Processing shortcode " + directFile);
            const rootRead = fs.readFileSync(rootFind).toString();
            const rootReplace = read.replace(match[0], `<script>${rootRead}</script>`);
            fs.writeFileSync(file, rootReplace);
            console.log(file.removeRoot() + " include script successfully");
          }
        }
        console.log("\n");
      }
    });
  }
}
