import Bagpipe from 'bagpipe';
import childProcess, { ChildProcess } from 'child_process';
import fs from 'fs-extra';
import kruptein from 'kruptein';
import objectAssign from 'object-assign';
import path from 'path';
import retry from 'retry';
import writeFileAtomic from 'write-file-atomic';

const isWindows = process.platform === 'win32';

const configs = {
  path: path.join(process.cwd(), 'sessions'),
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
  filePattern: null as any,
  crypto: {
    algorithm: 'aes-256-gcm',
    hashing: 'sha512',
    use_scrypt: true
  },
  keyFunction: function (secret: string, sessionId: string) {
    return secret + sessionId;
  }
};

export type sessionFileStoreConfig = typeof configs & Record<string, any>;

export function isSecret(secret: any) {
  return secret !== undefined && secret != null;
}
export function sessionPath(
  options: sessionFileStoreConfig,
  sessionId: string
) {
  //return path.join(basepath, sessionId + '.json');
  return path.join(options.path, sessionId + options.fileExtension);
}

export function sessionId(options: sessionFileStoreConfig, file: string) {
  //return file.substring(0, file.lastIndexOf('.json'));
  if (options.fileExtension.length === 0) return file;
  const id = file.replace(options.filePattern, '');
  return id === file ? '' : id;
}
export function getLastAccess(session: Record<string, any>) {
  return session['__lastAccess'];
}
export function setLastAccess(session: Record<string, any>) {
  session['__lastAccess'] = new Date().getTime();
}

export function escapeForRegExp(str: string) {
  return str.replace(/[|\\{}()[\]^$+*?.]/g, '\\$&');
}

export function getFilePatternFromFileExtension(fileExtension) {
  return new RegExp(escapeForRegExp(fileExtension) + '$');
}

export function defaults(userOptions: Partial<sessionFileStoreConfig>) {
  const options = objectAssign({}, configs, userOptions);
  options.path = path.normalize(options.path);
  options.filePattern = getFilePatternFromFileExtension(options.fileExtension);

  if (isSecret(options.secret)) options.kruptein = kruptein(options.crypto);

  return options;
}

export function destroyIfExpired(sessionId, options, callback) {
  expired(sessionId, options, function (err, expired) {
    if (err == null && expired) {
      destroy(sessionId, options, callback);
    } else if (callback) {
      err ? callback(err) : callback();
    }
  });
}

export function scheduleReap(options: sessionFileStoreConfig) {
  if (options.reapInterval !== -1) {
    options.reapIntervalObject = setInterval(function () {
      if (options.reapAsync) {
        options.logFn('[session-file-store] Starting reap worker thread');
        asyncReap(options);
      } else {
        options.logFn('[session-file-store] Deleting expired sessions');
        reap(options);
      }
    }, options.reapInterval * 1000).unref();
  }
}

export function asyncReap(
  options: sessionFileStoreConfig,
  callback?: (...args: any[]) => any
) {
  // fallback
  callback ||
    (callback = function () {
      //
    });

  function execCallback(err?: any) {
    if (err && options.reapSyncFallback) {
      reap(options, callback);
    } else {
      err ? callback(err) : callback();
    }
  }

  let child: ChildProcess;
  if (isWindows) {
    child = childProcess.spawn('node', [
      path.join(__dirname, 'reap-worker.js'),
      options.path,
      String(options.ttl)
    ]);
  } else {
    child = childProcess.spawn(path.join(__dirname, 'reap-worker.js'), [
      options.path,
      String(options.ttl)
    ]);
  }
  let hasError: boolean;
  child.once('error', function (e) {
    execCallback(e);
    hasError = true;
  });
  child.once('exit', function () {
    if (!hasError) execCallback();
  });
}

export function reap(
  options: sessionFileStoreConfig,
  callback?: (...args: any[]) => any
) {
  callback ||
    (callback = function () {
      //
    });
  list(options, function (err, files) {
    if (err) return callback(err);
    if (files.length === 0) return callback();

    const bagpipe = new Bagpipe(options.reapMaxConcurrent);

    const errors = [];
    files.forEach(function (file, i) {
      bagpipe.push(
        destroyIfExpired,
        sessionId(options, file),
        options,
        function (err) {
          if (err) {
            errors.push(err);
          }
          if (i >= files.length - 1) {
            errors.length > 0 ? callback(errors) : callback();
          }
        }
      );
    });
  });
}

/**
 * Attempts to fetch session from a session file by the given `sessionId`
 *
 * @param    sessionId
 * @param     options
 * @param callback
 *
 * @api public
 */
export function get(
  sessionId: string,
  options: sessionFileStoreConfig,
  callback: (...args: any[]) => any
) {
  const sessPath = sessionPath(options, sessionId);

  const operation = retry.operation({
    retries: options.retries,
    factor: options.factor,
    minTimeout: options.minTimeout,
    maxTimeout: options.maxTimeout
  });

  let encoding_type = options.encoding;
  if (isSecret(options.secret) && !options.encryptEncoding) {
    encoding_type = null;
  }
  operation.attempt(function () {
    fs.readFile(
      sessPath,
      { encoding: <any>encoding_type },
      function readCallback(err, data) {
        if (!err) {
          let json;

          if (isSecret(options.secret)) {
            data = options.decoder(decrypt(options, data, sessionId));
          }

          try {
            json = options.decoder(data.toString());
          } catch (parseError) {
            return fs.remove(sessPath, function (removeError) {
              if (removeError) {
                return callback(removeError);
              }

              callback(parseError);
            });
          }

          return callback(null, isExpired(json, options) ? null : json);
        }

        if (operation.retry(err)) {
          options.logFn(
            '[session-file-store] will retry, error on last attempt: ' + err
          );
        } else if (options.fallbackSessionFn) {
          const session = options.fallbackSessionFn(sessionId);
          setLastAccess(session);
          callback(null, session);
        } else {
          callback(err);
        }
      }
    );
  });
}

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
export function set(sessionId, session, options, callback) {
  try {
    setLastAccess(session);

    const sessPath = sessionPath(options, sessionId);
    let json = options.encoder(session);
    if (isSecret(options.secret)) {
      json = encrypt(options, json, sessionId);
    }
    writeFileAtomic(sessPath, json, function (err) {
      if (callback) {
        err ? callback(err) : callback(null, session);
      }
    });
  } catch (err) {
    if (callback) callback(err);
  }
}

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
export function touch(sessionId, session, options, callback) {
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

/**
 * Attempts to unlink a given session by its id
 *
 * @param  {String}   sessionId   Files are serialized to disk by their sessionId
 * @param  {Object}   options
 * @param  {Function} callback
 *
 * @api public
 */
export function destroy(sessionId, options, callback) {
  const sessPath = sessionPath(options, sessionId);
  try {
    fs.removeSync(sessPath);
    callback();
  } catch (error) {
    callback(error);
  }
}

/**
 * Attempts to fetch number of the session files
 *
 * @param  {Object}   options
 * @param  {Function} callback
 *
 * @api public
 */
export function length(options, callback) {
  fs.readdir(options.path, function (err, files) {
    if (err) return callback(err);

    let result = 0;
    files.forEach(function (file) {
      if (options.filePattern.exec(file)) {
        ++result;
      }
    });

    callback(null, result);
  });
}

/**
 * Attempts to clear out all of the existing session files
 *
 * @param  {Object}   options
 * @param  {Function} callback
 *
 * @api public
 */
export function clear(options, callback) {
  fs.readdir(options.path, function (err, files) {
    if (err) return callback([err]);
    if (files.length <= 0) return callback();

    const errors = [];
    files.forEach(function (file, i) {
      if (options.filePattern.exec(file)) {
        fs.remove(path.join(options.path, file), function (err) {
          if (err) {
            errors.push(err);
          }
          // TODO: wrong call condition (call after all completed attempts to remove instead of after completed attempt with last index)
          if (i >= files.length - 1) {
            errors.length > 0 ? callback(errors) : callback();
          }
        });
      } else {
        // TODO: wrong call condition (call after all completed attempts to remove instead of after completed attempt with last index)
        if (i >= files.length - 1) {
          errors.length > 0 ? callback(errors) : callback();
        }
      }
    });
  });
}

/**
 * Attempts to find all of the session files
 *
 * @param  {Object}   options
 * @param  {Function} callback
 *
 * @api public
 */
export function list(options, callback) {
  fs.readdir(options.path, function (err, files) {
    if (err) return callback(err);

    files = files.filter(function (file) {
      return options.filePattern.exec(file);
    });

    callback(null, files);
  });
}

/**
 * Attempts to detect whether a session file is already expired or not
 *
 * @param  {String}   sessionId
 * @param  {Object}   options
 * @param  {Function} callback
 *
 * @api public
 */
export function expired(sessionId, options, callback) {
  get(sessionId, options, function (err, session) {
    if (err) return callback(err);

    err ? callback(err) : callback(null, isExpired(session, options));
  });
}

export function isExpired(session, options) {
  if (!session) return true;

  const ttl =
    session.cookie && session.cookie.originalMaxAge
      ? session.cookie.originalMaxAge
      : options.ttl * 1000;
  return !ttl || getLastAccess(session) + ttl < new Date().getTime();
}

export function encrypt(options, data, _sessionId) {
  let ciphertext = null;

  options.kruptein.set(options.secret, data, function (err, ct) {
    if (err) throw err;

    ciphertext = ct;
  });

  return ciphertext;
}

export function decrypt(options, data, _sessionId) {
  let plaintext = null;

  options.kruptein.get(options.secret, data, function (err, pt) {
    if (err) throw err;

    plaintext = pt;
  });

  return plaintext;
}
