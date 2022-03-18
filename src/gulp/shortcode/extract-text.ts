export function extractText(file: string, read: string) {
  const matchFile = read.match(/\<\!\-\-\s+?extract-text\s+?.+?\s+?\-\-\>/gm);
  //console.log("extract text match", matchFile);
  if (matchFile && matchFile.length > 0) {
    console.log("extract text match", matchFile);
    matchFile.forEach(function (readied) {
      const match = readied.match(/\<\!\-\-\s+?extract-text\s+?(.+?)\s+?\-\-\>/);
      console.log("matched ", match);
    });
  }
  return read;
}
export default extractText;
