'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var Axios = require('axios');
var crypto = require('crypto');
var fs = require('fs-extra');
var glob = require('glob');
var path = require('upath');

function _interopNamespaceDefault(e) {
    var n = Object.create(null);
    if (e) {
        Object.keys(e).forEach(function (k) {
            if (k !== 'default') {
                var d = Object.getOwnPropertyDescriptor(e, k);
                Object.defineProperty(n, k, d.get ? d : {
                    enumerable: true,
                    get: function () { return e[k]; }
                });
            }
        });
    }
    n.default = e;
    return Object.freeze(n);
}

var fs__namespace = /*#__PURE__*/_interopNamespaceDefault(fs);
var glob__namespace = /*#__PURE__*/_interopNamespaceDefault(glob);
var path__namespace = /*#__PURE__*/_interopNamespaceDefault(path);

/**
 * MD5 file synchronously
 * @param path
 * @returns
 */
function md5FileSync(path) {
    let fileBuffer = Buffer.from(path);
    if (fs__namespace.existsSync(path)) {
        if (fs__namespace.statSync(path).isFile())
            fileBuffer = fs__namespace.readFileSync(path);
    }
    const hashSum = crypto.createHash('md5'); // sha256
    hashSum.update(fileBuffer);
    return hashSum.digest('hex');
}
/**
 * PHP MD5 Equivalent
 * @param data
 * @returns
 */
function md5(data) {
    return crypto.createHash('md5').update(data).digest('hex');
}
function md5File(path) {
    return new Promise((resolve, reject) => {
        const output = crypto.createHash('md5');
        const input = fs__namespace.createReadStream(path);
        input.on('error', (err) => {
            reject(err);
        });
        output.once('readable', () => {
            resolve(output.read().toString('hex'));
        });
        input.pipe(output);
    });
}
/**
 * convert file to hash
 * @param alogarithm
 * @param path
 * @param encoding
 * @returns
 */
function file_to_hash(alogarithm, path, encoding = 'hex') {
    return new Promise((resolve, reject) => {
        const hash = crypto.createHash(alogarithm);
        const rs = fs__namespace.createReadStream(path);
        rs.on('error', reject);
        rs.on('data', (chunk) => hash.update(chunk));
        rs.on('end', () => resolve(hash.digest(encoding)));
    });
}
/**
 * convert data to hash (async)
 * @param alogarithm
 * @param data
 * @param encoding
 * @returns
 */
function data_to_hash(alogarithm = 'sha1', data, encoding = 'hex') {
    return new Promise((resolve, reject) => {
        try {
            resolve(data_to_hash_sync(alogarithm, data, encoding));
        }
        catch (e) {
            reject(e);
        }
    });
}
/**
 * convert data to hash (sync)
 * @param alogarithm
 * @param data
 * @param encoding
 * @returns
 */
function data_to_hash_sync(alogarithm = 'sha1', data, encoding = 'hex') {
    return crypto.createHash(alogarithm).update(data).digest(encoding);
}
/**
 * get hashes from folder
 * @param alogarithm
 * @param folder
 * @param options
 * @returns
 */
async function folder_to_hash(alogarithm, folder, options) {
    return new Promise((resolvePromise, rejectPromise) => {
        options = Object.assign({
            encoding: 'hex',
            ignored: [],
            pattern: ''
        }, options || {});
        if (folder.startsWith('file:'))
            folder = folder.replace('file:', '');
        // fix non exist
        if (!fs__namespace.existsSync(folder))
            folder = path__namespace.join(__dirname, folder);
        // run only if exist
        if (fs__namespace.existsSync(folder)) {
            glob__namespace
                .glob(options.pattern || '**/*', {
                cwd: folder,
                ignore: (options.ignored || [
                    '**/tmp/**',
                    '**/build/**',
                    '**/.cache/**',
                    '**/dist/**',
                    '**/.vscode/**',
                    '**/coverage/**',
                    '**/release/**',
                    '**/bin/**',
                    '**/*.json'
                ]).concat('**/.git*/**', '**/node_modules/**'),
                dot: true,
                noext: true
            })
                .then((matches) => {
                const filesWithHash = {};
                for (let i = 0; i < matches.length; i++) {
                    const item = matches[i];
                    const fullPath = path__namespace.join(folder, item);
                    const statInfo = fs__namespace.statSync(fullPath);
                    if (statInfo.isFile()) {
                        const fileInfo = `${fullPath}:${statInfo.size}:${statInfo.mtimeMs}`;
                        const hash = data_to_hash_sync(alogarithm, fileInfo, options.encoding);
                        filesWithHash[fullPath] = hash;
                    }
                }
                resolvePromise({
                    filesWithHash,
                    hash: data_to_hash_sync(alogarithm, Object.values(filesWithHash).join(''), options.encoding)
                });
            })
                .catch(rejectPromise);
        }
        else {
            console.log(folder + ' not found');
        }
    });
}
/**
 * convert data to hash
 * @param alogarithm
 * @param url
 * @param encoding
 * @returns
 */
async function url_to_hash(alogarithm = 'sha1', url, encoding = 'hex') {
    return new Promise((resolve, reject) => {
        let outputLocationPath = path__namespace.join(__dirname, 'node_modules/.cache/postinstall', path__namespace.basename(url));
        // remove slashes when url ends with slash
        if (!path__namespace.basename(url).endsWith('/')) {
            outputLocationPath = outputLocationPath.replace(/\/$/, '');
        }
        // add extension when dot not exist
        if (!path__namespace.basename(url).includes('.')) {
            outputLocationPath += '.tgz';
        }
        if (!fs__namespace.existsSync(path__namespace.dirname(outputLocationPath))) {
            fs__namespace.mkdirSync(path__namespace.dirname(outputLocationPath), { recursive: true });
        }
        const writer = fs__namespace.createWriteStream(outputLocationPath, { flags: 'w' });
        Axios(url, { responseType: 'stream' }).then((response) => {
            response.data.pipe(writer);
            let error;
            writer.on('error', (err) => {
                error = err;
                writer.close();
                reject(err);
            });
            writer.on('close', async () => {
                if (!error) {
                    // console.log('package downloaded', outputLocationPath.replace(__dirname, ''));
                    file_to_hash(alogarithm, outputLocationPath, encoding).then((checksum) => {
                        resolve(checksum);
                    });
                }
            });
        });
    });
}

exports.data_to_hash = data_to_hash;
exports.data_to_hash_sync = data_to_hash_sync;
exports.default = md5File;
exports.file_to_hash = file_to_hash;
exports.folder_to_hash = folder_to_hash;
exports.md5 = md5;
exports.md5FileSync = md5FileSync;
exports.url_to_hash = url_to_hash;
