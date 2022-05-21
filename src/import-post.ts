export function shortcodeImportPost(file: string, str: string) {
  const matches = [
    /<!--\s+?include-post\s+?(.+?)\s+?-->/gim,
    /<!--\s+?import-post\s+?(.+?)\s+?-->/gim
  ]
    .map((regex) => Array.from(str.matchAll(regex)))
    .filter((m) => Array.isArray(m) && m.length);
  for (let u = 0; u < matches.length; u++) {
    const m = matches[u];
    m.forEach((t) => {
      console.log(t);
    });
  }
}
