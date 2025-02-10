import ansiColors from 'ansi-colors';
import fs from 'fs-extra';
import * as hpp from 'hexo-post-parser';
import moment from 'moment-timezone';
import pLimit from 'p-limit';
import {
  debug,
  fixDriveLetter,
  getConfig,
  jsonParseWithCircularRefs,
  jsonStringifyWithCircularRefs,
  Logger,
  md5,
  normalizePath
} from 'sbg-utility';
import path from 'upath';
import { parseDynamicArray } from '../utils/array';
import { parsePermalink } from './permalink';

/**
 * log debug
 *
 * @example
 * cross-env-shell DEBUG=* "your commands"
 */
const log = debug('post');
const logErr = log.extend('error');
const logLabel = log.extend('label');

/**
 * Reads a file asynchronously and processes its contents.
 *
 * @param filePath - The path to the file.
 * @param onComplete - Callback function when processing is complete.
 * @param onError - Callback function for handling errors.
 */
export function processFile(
  filePath: string,
  onComplete: (content: string) => void | Promise<void>,
  onError: (err: Error) => void | Promise<void>
) {
  const chunks: string[] = []; // Array to store chunks
  filePath = normalizePath(filePath);
  const readStream = fs.createReadStream(filePath, { encoding: 'utf-8' });

  readStream.on('data', (chunk) => {
    // Store each chunk of data
    if (Buffer.isBuffer(chunk)) {
      chunks.push(Buffer.from(chunk).toString());
    } else {
      chunks.push(chunk);
    }
  });

  readStream.on('end', () => {
    const fullContent = chunks.join(''); // Concatenate all chunks
    log('File processed:', filePath);

    // Call onComplete and handle async resolution outside of the Promise executor
    Promise.resolve(onComplete(fullContent)).catch((err) => {
      logErr('Error in onComplete:', filePath, err);
    });
  });

  readStream.on('error', (err) => {
    logErr('Error reading file:', filePath, err);

    // Call onError and handle async resolution outside of the Promise executor
    Promise.resolve(onError(err)).catch((error) => {
      logErr('Error in onError:', filePath, error);
    });
  });
}

const limit = pLimit(10); // Limit concurrency to 10 tasks

/**
 * Processes multiple files concurrently with a limit.
 *
 * @param filePaths - List of file paths.
 * @param onComplete - Callback for successful processing.
 * @param onError - Callback for errors.
 */
export async function processFiles(
  filePaths: string[],
  onComplete: (filePath: string, content: string) => void | Promise<void>,
  onError: (filePath: string, err: Error) => void | Promise<void>
) {
  const promises = filePaths
    .map((s) => normalizePath(s))
    .map((filePath) =>
      limit(
        () =>
          new Promise<void>((resolve) => {
            processFile(
              filePath,
              (content) => {
                Promise.resolve(onComplete(filePath, content)).then(() => {
                  resolve();
                });
              },
              (err) => {
                Promise.resolve(onError(filePath, err)).then(() => {
                  resolve();
                });
              }
            );
          })
      )
    );
  await Promise.all(promises);
}

/**
 * Parses a single Markdown post.
 *
 * @param options - Contains file path or content.
 * @param config - Configuration object.
 * @param callback - Optional function for parsed data.
 * @returns Processed front-matter Markdown content or undefined.
 */
export async function parseMarkdownPost(
  options: { file?: string | null; content?: string | null },
  config: ReturnType<typeof getConfig>,
  callback?: (result: hpp.postMap) => any
) {
  const { content, file } = options;
  if (!file && !content) return;
  let dfile: string | undefined = undefined;
  let contents: string | undefined = undefined;
  if (typeof content === 'string') {
    // console.log(file, 'using property content');
    contents = content;
  } else if (typeof file === 'string' && (await fs.exists(file))) {
    // console.log(file, 'using property file');
    contents = fs.readFileSync(file, 'utf-8');
  }
  if (file) {
    // debug file
    dfile = ansiColors.yellowBright(normalizePath(file.replace(config.cwd, '')));
    log('processing', dfile);
  }
  if (!contents) return;

  const cacheId = md5(contents);
  const cacheFolder = path.join(config.cwd, 'tmp/hexo-post-parser/parseMarkdownPost');
  const cachePath = path.join(cacheFolder, cacheId + '.json');
  let cacheContent: { parseResult: hpp.postMap; build: string };
  if (await fs.exists(cachePath)) {
    cacheContent = jsonParseWithCircularRefs(await fs.readFile(cachePath, 'utf-8'));
    if (typeof callback === 'function') {
      callback(cacheContent.parseResult);
    }
    return cacheContent.build;
  }

  try {
    const parseResult = await hpp
      .parsePost(contents, {
        shortcodes: {
          youtube: true,
          css: true,
          include: true,
          link: true,
          now: true,
          script: true,
          text: true,
          codeblock: true
        },
        cache: config.generator.cache || false,
        config: <any>config,
        formatDate: true,
        fix: true,
        sourceFile: file
      })
      .catch((e: any) => Logger.log(e));

    if (parseResult && parseResult.metadata) {
      if (parseResult.metadata.date) {
        // skip scheduled post
        const createdDate = moment(String(parseResult.metadata.date));
        const today = moment(new Date());
        const diff = today.diff(createdDate);
        // log('today=' + today.format(), 'created=' + createdDate.format(), 'isGreater=' + String(diff));
        // if creation date greater than now
        // if (moment(new Date()).isAfter(createdDate)) {
        if (diff < 0) {
          if (dfile) log('skip scheduled post ' + dfile);
          // otherwise return null
          return;
        }
      }
      // fix permalink
      log.extend('permalink').extend('pattern')(config.permalink);
      //parse.metadata.permalink = hexoPostParser.parsePermalink(parse);
      if (!parseResult.metadata.permalink && file) {
        parseResult.metadata.permalink = parsePermalink(file, {
          title: parseResult.metadata.title,
          date: String(parseResult.metadata.date || new Date()),
          permalink_pattern: config.permalink
        });
      }
      if (parseResult.metadata.permalink) {
        parseResult.metadata.permalink = path.toUnix(parseResult.metadata.permalink);
        if (parseResult.metadata.permalink.startsWith('/')) {
          parseResult.metadata.permalink = parseResult.metadata.permalink.replace(/^\//, '');
        }

        log.extend('permalink')(parseResult.metadata.permalink);
      }
      // fix uuid and id
      if (parseResult.metadata.uuid) {
        if (!parseResult.metadata.id) parseResult.metadata.id = parseResult.metadata.uuid;
        delete parseResult.metadata.uuid;
      }
      // process tags and categories
      if (parseResult.metadata['category'] && !parseResult.metadata['categories']) {
        parseResult.metadata['categories'] = parseResult.metadata['category'];
        delete parseResult.metadata['category'];
      }
      if (parseResult.metadata['tag'] && !parseResult.metadata['tags']) {
        parseResult.metadata['tags'] = parseResult.metadata['tag'];
        delete parseResult.metadata['tag'];
      }
      const array = ['tags', 'categories'];
      for (let i = 0; i < array.length; i++) {
        const groupLabel = array[i];
        if (!parseResult.metadata[groupLabel]) parseResult.metadata[groupLabel] = [];
        if (parseResult.metadata[groupLabel]) {
          // label assign
          if (config[groupLabel]?.assign) {
            for (const oldLabel in config[groupLabel].assign) {
              if (typeof parseResult.metadata[groupLabel].findIndex !== 'function') {
                if (typeof parseResult.metadata[groupLabel] === 'string') {
                  try {
                    const arr = parseDynamicArray(parseResult.metadata[groupLabel]);
                    parseResult.metadata[groupLabel] = arr;
                  } catch (e: any) {
                    console.log(
                      parseResult.metadata[groupLabel],
                      `findIndex not found for ${groupLabel} type ${typeof parseResult.metadata[groupLabel]} (${e.message})`
                    );
                    continue;
                  }
                } else {
                  console.log(
                    parseResult.metadata[groupLabel],
                    `findIndex not found for ${groupLabel} type ${typeof parseResult.metadata[groupLabel]}`
                  );
                  continue;
                }
              }
              const index = parseResult.metadata[groupLabel].findIndex((str: string) => str == oldLabel);

              if (index !== -1) {
                logLabel(
                  groupLabel,
                  parseResult.metadata[groupLabel],
                  ansiColors.yellowBright('+'),
                  config[groupLabel].assign[oldLabel]
                );
                parseResult.metadata[groupLabel] = parseResult.metadata[groupLabel].concat(
                  config[groupLabel].assign[oldLabel]
                );
                logLabel.extend('result')(groupLabel, parseResult.metadata[groupLabel]);
              }
            }
          }
          // label mapper
          if (config[groupLabel]?.mapper) {
            for (const oldLabel in config[groupLabel].mapper) {
              const index = parseResult.metadata[groupLabel].findIndex((str: string) => str === oldLabel);

              if (index !== -1) {
                parseResult.metadata[groupLabel][index] = config[groupLabel].mapper[oldLabel];
                if (config.generator.verbose) {
                  Logger.log(
                    ansiColors.redBright(parseResult.metadata[groupLabel][index]),
                    '~>',
                    ansiColors.greenBright(config[groupLabel].mapper[oldLabel])
                  );
                }
              }
            }
          }
          // label lowercase
          if (config.tags?.lowercase) {
            parseResult.metadata[groupLabel] =
              (parseResult.metadata[groupLabel] as any[])?.map((str) => {
                if (typeof str === 'string') return str.toLowerCase();
                if (Array.isArray(str)) {
                  return str.map((s) => {
                    if (typeof s === 'string') return s.toLowerCase();
                    return s;
                  });
                }
                return str;
              }) || [];
            log.extend('label').extend('lowercase')(groupLabel, parseResult.metadata[groupLabel]);
          }
        } else if (config.generator.verbose) {
          Logger.log(groupLabel, 'not found');
        }

        // Logger.log(groupLabel + '-' + ansiColors.greenBright('assign'), parse.metadata[groupLabel]);
      }

      /**
       * Fixes file paths by removing the drive letter prefix and handling URLs.
       * If the path is a valid URL, it returns it unchanged. Otherwise, it processes
       * the file path by removing the drive letter (from both the root and sub-paths).
       *
       * @param {string | undefined} filePath - The file path to fix.
       * @returns {string | undefined} - The fixed file path, or the original URL if it's a valid URL.
       */
      const fixPaths = (filePath: string | undefined): string | undefined => {
        if (!filePath) return filePath;

        // Check if the filePath is a valid URL (using URL constructor)
        try {
          new URL(filePath);
          // If it's a valid URL, return it unchanged
          return filePath;
        } catch (_) {
          // If it's not a valid URL, process it as a file path
          const fullPath = fixDriveLetter(config.cwd);
          const cleanedPath = filePath
            .replace(fullPath + '/', '')
            .replace(fullPath, '')
            .replace(config.root, '');
          return cleanedPath;
        }
      };

      if (parseResult?.metadata && config.post_asset_folder) {
        parseResult.metadata.photos = parseResult.metadata.photos?.map(fixPaths);
        parseResult.metadata.cover = fixPaths(parseResult.metadata.cover);
        parseResult.metadata.thumbnail = fixPaths(parseResult.metadata.thumbnail);
      }

      const build = hpp.buildPost(parseResult);

      cacheContent = {
        parseResult,
        build
      };
      await fs.ensureDir(path.dirname(cachePath));
      await fs.writeFile(cachePath, jsonStringifyWithCircularRefs(cacheContent));

      if (typeof callback === 'function') {
        callback(parseResult);
      }

      if (typeof build === 'string') {
        return build;
      }
    } else {
      logErr(String(parseResult), file);
    }
  } catch (e) {
    Logger.log(e);
  }
}
