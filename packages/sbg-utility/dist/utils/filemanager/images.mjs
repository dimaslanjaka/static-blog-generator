import fs__default from 'fs-extra';

/**
 * function to encode file data to base64 encoded string
 * @param file path file
 * @returns
 */
function image_base64_encode(file) {
    // read binary data
    const bitmap = fs__default.readFileSync(file);
    // convert binary data to base64 encoded string
    return bitmap.toString('base64');
}

export { image_base64_encode };
