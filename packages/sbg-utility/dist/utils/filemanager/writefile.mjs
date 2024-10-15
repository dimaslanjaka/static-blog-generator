import fs__default from 'fs-extra';
import path__default from 'upath';

/**
 * sync write to file recursively (auto create dirname)
 * @param file
 * @param content
 * @param opt
 */
function writefile(file, content, opt = {}) {
    // create dirname when not exist
    if (!fs__default.existsSync(path__default.dirname(file)))
        fs__default.mkdirSync(path__default.dirname(file), Object.assign({ recursive: true }, opt));
    const result = {
        file,
        append: false
    };
    // transform object
    if (typeof content === 'object') {
        content = JSON.stringify(content, null, 2);
    }
    if (opt.append) {
        result.append = true;
        fs__default.appendFileSync(file, content);
    }
    else {
        fs__default.writeFileSync(file, content);
    }
    if (opt.async)
        return Promise.resolve(result);
    return result;
}

export { writefile };
