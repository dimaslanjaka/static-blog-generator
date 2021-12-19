import fs from "fs";
import "../../../packages/hexo-seo/packages/js-prototypes/src/String";

/**
 * Current date time
 * @return string ex> '2012-11-04 14:55:45'
 */
export function now() {
  return (
    new Date()
      //.toISOString()
      .toLocaleString("en-US", {
        timeZone: "Asia/Jakarta",
      })
      .replace(/T/, " ") // replace T with a space
      .replace(/\..+/, "")
  ); // delete the dot and everything after
}

/**
 * Transform `now shortcode` to current formatted time
 * ```html
 * <!-- now() -->
 * ```
 * @param file
 * @see {@link now}
 */
export function shortcodeNow(file: string | fs.PathLike) {
  if (!fs.statSync(file).isFile()) {
    console.log("[" + file.toString().replace(process.cwd(), "") + "] its a directory, not a file");
    return;
  }
  const rex = /<!-- now\(\) -->/gm;
  const read = fs.readFileSync(file).toString();
  const matchRegex = read.match(rex);
  if (matchRegex && matchRegex.length > 0) {
    const replaceNow = read.replace(rex, now());
    fs.writeFileSync(file, replaceNow);
    console.log("[" + file.toString().replace(process.cwd(), "") + "] done");
  }
}
