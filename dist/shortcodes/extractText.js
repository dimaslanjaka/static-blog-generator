"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.extractText = void 0;
const tslib_1 = require("tslib");
const chalk_1 = tslib_1.__importDefault(require("chalk"));
const fs = tslib_1.__importStar(require("fs"));
const path_1 = tslib_1.__importDefault(require("path"));
const _config_1 = require("../types/_config");
const logname = chalk_1.default.bgMagenta.whiteBright('[extract-text]');
function extractText(file, str) {
    const regex = /<!--\s+?extract-text\s+?(.+?)\s+?-->/gim;
    let m;
    while ((m = regex.exec(str)) !== null) {
        // This is necessary to avoid infinite loops with zero-width matches
        if (m.index === regex.lastIndex) {
            regex.lastIndex++;
        }
        const allmatch = m[0];
        const bracketmatch = m[1];
        //console.info(logname, allmatch, bracketmatch);
        // search from file directory
        const directFile = path_1.default.join(path_1.default.dirname(file.toString()), bracketmatch);
        if (fs.existsSync(directFile)) {
            if (_config_1.verbose)
                console.info(`${logname} found from direct ${directFile.replace(process.cwd() + '/', '')}`);
            const directRead = fs.readFileSync(directFile).toString();
            str = str.replace(allmatch, directRead);
        }
        else {
            // search from workspace directory
            if (_config_1.verbose)
                console.info(`${logname} found from workspace ${directFile.replace(process.cwd() + '/', '')}`);
            const rootFile = path_1.default.join(process.cwd(), bracketmatch);
            if (fs.existsSync(rootFile)) {
                const rootRead = fs.readFileSync(rootFile).toString();
                str = str.replace(allmatch, () => rootRead);
            }
        }
    }
    return str;
}
exports.extractText = extractText;
exports.default = extractText;
//# sourceMappingURL=extractText.js.map