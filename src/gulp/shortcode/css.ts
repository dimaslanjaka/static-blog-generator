import fs from "fs";
import path from "path";
import "../../../packages/hexo-seo/packages/js-prototypes/src/String";

/**
 * Parse shortcode css
 * ```html
 * <!-- css /path/file.css -->
 * ```
 * @param file markdown file
 * @returns
 */
export function shortcodeCss(file: string) {
  if (!fs.statSync(file).isFile()) {
    console.log("[" + file.toString().replace(process.cwd(), "") + "] its a directory, not a file");
    return;
  }
  const read = fs.readFileSync(file).toString();
  const matchFile = read.match(/\<\!\-\-\s+?css\s+?.+?\s+?\-\-\>/gm);
  if (matchFile && matchFile.length > 0) {
    matchFile.forEach(function (readied) {
      const match = readied.match(/\<\!\-\-\s+?css\s+?(.+?)\s+?\-\-\>/);
      //console.log("matched ", match);
      if (match && match.length > 1) {
        const directFile = path.join(path.dirname(file), match[1]);
        const directFind = fs.existsSync(directFile);
        if (directFind) {
          console.log("[direct] Processing shortcode " + directFile);
          const directRead = fs.readFileSync(directFile).toString();
          const directReplace = read.replace(match[0], `<style>${directRead}</style>`);
          fs.writeFileSync(file, directReplace);
          console.log(file.replace(process.cwd(), "") + " include style successfully");
        } else {
          console.error(match[1] + " not inline with " + file.replace(process.cwd(), ""));
          const rootFind = path.join(process.cwd(), match[1]);
          if (fs.existsSync(rootFind)) {
            console.log("[root] Processing shortcode " + directFile);
            const rootRead = fs.readFileSync(rootFind).toString();
            const rootReplace = read.replace(match[0], `<style>${rootRead}</style>`);
            fs.writeFileSync(file, rootReplace);
            console.log(file.replace(process.cwd(), "") + " include style successfully");
          }
        }
        console.log("\n");
      }
    });
  }
}
