import fs from 'fs-extra';

/**
 * function to encode file data to base64 encoded string
 * @param file path file
 * @returns
 */
export function image_base64_encode(file: string) {
  // read binary data
  const bitmap = fs.readFileSync(file);
  // convert binary data to base64 encoded string
  return bitmap.toString('base64');
}
