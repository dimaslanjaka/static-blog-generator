"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.decrypt = exports.encrypt = exports.isExpired = exports.expired = exports.list = exports.clear = exports.length = exports.destroy = exports.touch = exports.set = exports.get = exports.reap = exports.asyncReap = exports.scheduleReap = exports.destroyIfExpired = exports.defaults = exports.getFilePatternFromFileExtension = exports.escapeForRegExp = exports.setLastAccess = exports.getLastAccess = exports.sessionId = exports.sessionPath = exports.isSecret = void 0;
var bagpipe_1 = __importDefault(require("bagpipe"));
var child_process_1 = __importDefault(require("child_process"));
var fs_extra_1 = __importDefault(require("fs-extra"));
var kruptein_1 = __importDefault(require("kruptein"));
var object_assign_1 = __importDefault(require("object-assign"));
var path_1 = __importDefault(require("path"));
var retry_1 = __importDefault(require("retry"));
var write_file_atomic_1 = __importDefault(require("write-file-atomic"));
var isWindows = process.platform === 'win32';
var configs = {
    path: path_1.default.join(process.cwd(), 'sessions'),
    ttl: 3600,
    retries: 5,
    factor: 1,
    minTimeout: 50,
    maxTimeout: 100,
    reapInterval: 3600,
    reapMaxConcurrent: 10,
    reapAsync: false,
    reapSyncFallback: false,
    logFn: console['log'],
    encoding: 'utf8',
    encoder: JSON['stringify'],
    decoder: JSON['parse'],
    encryptEncoding: 'hex',
    fileExtension: '.json',
    filePattern: null,
    crypto: {
        algorithm: 'aes-256-gcm',
        hashing: 'sha512',
        use_scrypt: true
    },
    keyFunction: function (secret, sessionId) {
        return secret + sessionId;
    }
};
function isSecret(secret) {
    return secret !== undefined && secret != null;
}
exports.isSecret = isSecret;
function sessionPath(options, sessionId) {
    //return path.join(basepath, sessionId + '.json');
    return path_1.default.join(options.path, sessionId + options.fileExtension);
}
exports.sessionPath = sessionPath;
function sessionId(options, file) {
    //return file.substring(0, file.lastIndexOf('.json'));
    if (options.fileExtension.length === 0)
        return file;
    var id = file.replace(options.filePattern, '');
    return id === file ? '' : id;
}
exports.sessionId = sessionId;
function getLastAccess(session) {
    return session['__lastAccess'];
}
exports.getLastAccess = getLastAccess;
function setLastAccess(session) {
    session['__lastAccess'] = new Date().getTime();
}
exports.setLastAccess = setLastAccess;
function escapeForRegExp(str) {
    return str.replace(/[|\\{}()[\]^$+*?.]/g, '\\$&');
}
exports.escapeForRegExp = escapeForRegExp;
function getFilePatternFromFileExtension(fileExtension) {
    return new RegExp(escapeForRegExp(fileExtension) + '$');
}
exports.getFilePatternFromFileExtension = getFilePatternFromFileExtension;
function defaults(userOptions) {
    var options = (0, object_assign_1.default)({}, configs, userOptions);
    options.path = path_1.default.normalize(options.path);
    options.filePattern = getFilePatternFromFileExtension(options.fileExtension);
    if (isSecret(options.secret))
        options.kruptein = (0, kruptein_1.default)(options.crypto);
    return options;
}
exports.defaults = defaults;
function destroyIfExpired(sessionId, options, callback) {
    expired(sessionId, options, function (err, expired) {
        if (err == null && expired) {
            destroy(sessionId, options, callback);
        }
        else if (callback) {
            err ? callback(err) : callback();
        }
    });
}
exports.destroyIfExpired = destroyIfExpired;
function scheduleReap(options) {
    if (options.reapInterval !== -1) {
        options.reapIntervalObject = setInterval(function () {
            if (options.reapAsync) {
                options.logFn('[session-file-store] Starting reap worker thread');
                asyncReap(options);
            }
            else {
                options.logFn('[session-file-store] Deleting expired sessions');
                reap(options);
            }
        }, options.reapInterval * 1000).unref();
    }
}
exports.scheduleReap = scheduleReap;
function asyncReap(options, callback) {
    // fallback
    callback ||
        (callback = function () {
            //
        });
    function execCallback(err) {
        if (err && options.reapSyncFallback) {
            reap(options, callback);
        }
        else {
            err ? callback(err) : callback();
        }
    }
    var child;
    if (isWindows) {
        child = child_process_1.default.spawn('node', [
            path_1.default.join(__dirname, 'reap-worker.js'),
            options.path,
            String(options.ttl)
        ]);
    }
    else {
        child = child_process_1.default.spawn(path_1.default.join(__dirname, 'reap-worker.js'), [
            options.path,
            String(options.ttl)
        ]);
    }
    var hasError;
    child.once('error', function (e) {
        execCallback(e);
        hasError = true;
    });
    child.once('exit', function () {
        if (!hasError)
            execCallback();
    });
}
exports.asyncReap = asyncReap;
function reap(options, callback) {
    callback ||
        (callback = function () {
            //
        });
    list(options, function (err, files) {
        if (err)
            return callback(err);
        if (files.length === 0)
            return callback();
        var bagpipe = new bagpipe_1.default(options.reapMaxConcurrent);
        var errors = [];
        files.forEach(function (file, i) {
            bagpipe.push(destroyIfExpired, sessionId(options, file), options, function (err) {
                if (err) {
                    errors.push(err);
                }
                if (i >= files.length - 1) {
                    errors.length > 0 ? callback(errors) : callback();
                }
            });
        });
    });
}
exports.reap = reap;
/**
 * Attempts to fetch session from a session file by the given `sessionId`
 *
 * @param    sessionId
 * @param     options
 * @param callback
 *
 * @api public
 */
function get(sessionId, options, callback) {
    var sessPath = sessionPath(options, sessionId);
    var operation = retry_1.default.operation({
        retries: options.retries,
        factor: options.factor,
        minTimeout: options.minTimeout,
        maxTimeout: options.maxTimeout
    });
    var encoding_type = options.encoding;
    if (isSecret(options.secret) && !options.encryptEncoding) {
        encoding_type = null;
    }
    operation.attempt(function () {
        fs_extra_1.default.readFile(sessPath, { encoding: encoding_type }, function readCallback(err, data) {
            if (!err) {
                var json = void 0;
                if (isSecret(options.secret)) {
                    data = options.decoder(decrypt(options, data, sessionId));
                }
                try {
                    json = options.decoder(data.toString());
                }
                catch (parseError) {
                    return fs_extra_1.default.remove(sessPath, function (removeError) {
                        if (removeError) {
                            return callback(removeError);
                        }
                        callback(parseError);
                    });
                }
                return callback(null, isExpired(json, options) ? null : json);
            }
            if (operation.retry(err)) {
                options.logFn('[session-file-store] will retry, error on last attempt: ' + err);
            }
            else if (options.fallbackSessionFn) {
                var session = options.fallbackSessionFn(sessionId);
                setLastAccess(session);
                callback(null, session);
            }
            else {
                callback(err);
            }
        });
    });
}
exports.get = get;
/**
 * Attempts to commit the given `session` associated with the given `sessionId` to a session file
 *
 * @param {String}   sessionId
 * @param {Object}   session
 * @param  {Object}  options
 * @param {Function} callback (optional)
 *
 * @api public
 */
function set(sessionId, session, options, callback) {
    try {
        setLastAccess(session);
        var sessPath = sessionPath(options, sessionId);
        var json = options.encoder(session);
        if (isSecret(options.secret)) {
            json = encrypt(options, json, sessionId);
        }
        (0, write_file_atomic_1.default)(sessPath, json, function (err) {
            if (callback) {
                err ? callback(err) : callback(null, session);
            }
        });
    }
    catch (err) {
        if (callback)
            callback(err);
    }
}
exports.set = set;
/**
 * Update the last access time and the cookie of given `session` associated with the given `sessionId` in session file.
 * Note: Do not change any other session data.
 *
 * @param {String}   sessionId
 * @param {Object}   session
 * @param {Object}   options
 * @param {Function} callback (optional)
 *
 * @api public
 */
function touch(sessionId, session, options, callback) {
    get(sessionId, options, function (err, originalSession) {
        if (err) {
            callback(err, null);
            return;
        }
        if (!originalSession) {
            originalSession = {};
        }
        if (session.cookie) {
            // Update cookie details
            originalSession.cookie = session.cookie;
        }
        // Update `__lastAccess` property and save to store
        set(sessionId, originalSession, options, callback);
    });
}
exports.touch = touch;
/**
 * Attempts to unlink a given session by its id
 *
 * @param  {String}   sessionId   Files are serialized to disk by their sessionId
 * @param  {Object}   options
 * @param  {Function} callback
 *
 * @api public
 */
function destroy(sessionId, options, callback) {
    var sessPath = sessionPath(options, sessionId);
    try {
        fs_extra_1.default.removeSync(sessPath);
        callback();
    }
    catch (error) {
        callback(error);
    }
}
exports.destroy = destroy;
/**
 * Attempts to fetch number of the session files
 *
 * @param  {Object}   options
 * @param  {Function} callback
 *
 * @api public
 */
function length(options, callback) {
    fs_extra_1.default.readdir(options.path, function (err, files) {
        if (err)
            return callback(err);
        var result = 0;
        files.forEach(function (file) {
            if (options.filePattern.exec(file)) {
                ++result;
            }
        });
        callback(null, result);
    });
}
exports.length = length;
/**
 * Attempts to clear out all of the existing session files
 *
 * @param  {Object}   options
 * @param  {Function} callback
 *
 * @api public
 */
function clear(options, callback) {
    fs_extra_1.default.readdir(options.path, function (err, files) {
        if (err)
            return callback([err]);
        if (files.length <= 0)
            return callback();
        var errors = [];
        files.forEach(function (file, i) {
            if (options.filePattern.exec(file)) {
                fs_extra_1.default.remove(path_1.default.join(options.path, file), function (err) {
                    if (err) {
                        errors.push(err);
                    }
                    // TODO: wrong call condition (call after all completed attempts to remove instead of after completed attempt with last index)
                    if (i >= files.length - 1) {
                        errors.length > 0 ? callback(errors) : callback();
                    }
                });
            }
            else {
                // TODO: wrong call condition (call after all completed attempts to remove instead of after completed attempt with last index)
                if (i >= files.length - 1) {
                    errors.length > 0 ? callback(errors) : callback();
                }
            }
        });
    });
}
exports.clear = clear;
/**
 * Attempts to find all of the session files
 *
 * @param  {Object}   options
 * @param  {Function} callback
 *
 * @api public
 */
function list(options, callback) {
    fs_extra_1.default.readdir(options.path, function (err, files) {
        if (err)
            return callback(err);
        files = files.filter(function (file) {
            return options.filePattern.exec(file);
        });
        callback(null, files);
    });
}
exports.list = list;
/**
 * Attempts to detect whether a session file is already expired or not
 *
 * @param  {String}   sessionId
 * @param  {Object}   options
 * @param  {Function} callback
 *
 * @api public
 */
function expired(sessionId, options, callback) {
    get(sessionId, options, function (err, session) {
        if (err)
            return callback(err);
        err ? callback(err) : callback(null, isExpired(session, options));
    });
}
exports.expired = expired;
function isExpired(session, options) {
    if (!session)
        return true;
    var ttl = session.cookie && session.cookie.originalMaxAge
        ? session.cookie.originalMaxAge
        : options.ttl * 1000;
    return !ttl || getLastAccess(session) + ttl < new Date().getTime();
}
exports.isExpired = isExpired;
function encrypt(options, data, _sessionId) {
    var ciphertext = null;
    options.kruptein.set(options.secret, data, function (err, ct) {
        if (err)
            throw err;
        ciphertext = ct;
    });
    return ciphertext;
}
exports.encrypt = encrypt;
function decrypt(options, data, _sessionId) {
    var plaintext = null;
    options.kruptein.get(options.secret, data, function (err, pt) {
        if (err)
            throw err;
        plaintext = pt;
    });
    return plaintext;
}
exports.decrypt = decrypt;
//# sourceMappingURL=session-file-helpers.js.map