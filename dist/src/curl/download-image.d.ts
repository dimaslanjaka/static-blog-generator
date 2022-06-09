/// <reference types="node" />
interface cacheDownloadImageData {
    /**
     * original save location
     */
    path: string;
    /**
     * base64 image data
     */
    content: string;
    pipe?: NodeJS.WritableStream;
}
/**
 * download images
 * @param src source url string
 * @param saveTo save directory path or file path
 * * If the Save target is a directory, then the file name will be searched by the 'Content-Disposition' header or based on MD5 Hash Source URL
 */
export default function downloadImage(src: string, saveTo: string, cache?: boolean): Promise<Partial<cacheDownloadImageData>>;
/**
 * parse image base64 encoded
 * @param data
 * @returns
 */
declare function parse_base64_image(data: string): {
    /** extension name */
    extname: string;
    /** base64 encoded */
    base64: string;
};
/**
 * Convert image base64 data to img
 *
 * @param data
 * @param destpath
 * @param name default null
 * @param callback default null
 * @returns string path file
 * @example
 * // save to directory with filename
 * base64_to_image('data:image/png;base64,...', '/folder/name', 'file-name', function(err, filepath) {});
 * // remove first data:image/png;base64, from {@param data}
 * // save to file directly with callback
 * base64_to_image('base64_encoded_string', '/folder/filename.jpg', null, function(err, filepath) {});
 * // save to file directly without callback, return string
 * base64_to_image('base64_encoded_string', '/folder/filename.jpg', null, null);
 */
declare function base64_to_image(data: string, destpath: string, name?: string | null, callback?: null | ((arg0: NodeJS.ErrnoException, arg1: string) => any)): string | void;
export { base64_to_image, parse_base64_image };
