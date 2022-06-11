"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.parsePermalink = void 0;
var upath_1 = require("upath");
var date_1 = require("../renderer/ejs/helper/date");
var _config_1 = __importDefault(require("../types/_config"));
/**
 * transform permalink format in `_config.yml`
 * @param post
 */
function parsePermalink(post) {
    var pattern = _config_1.default.permalink;
    var date = (0, date_1.modMoment)(post.metadata.date);
    var replacer = {
        ':month': 'MM',
        ':year': 'YYYY',
        ':day': 'DD',
        ':i_month': 'M',
        ':hour': 'HH',
        ':minute': 'mm',
        ':second': 'ss',
        ':title': (0, upath_1.basename)(post.metadata.permalink).replace(/.(md|html)$/, ''),
        ':post_title': post.metadata.title
    };
    // @todo [permalink] follow directory path
    if (pattern.startsWith(':title')) {
        var bname = pattern.replace(':title', replacer[':title']);
        var perm = (0, upath_1.join)((0, upath_1.dirname)(post.metadata.permalink), bname);
        //console.log(perm);
        return perm;
    }
    Object.keys(replacer).forEach(function (date_pattern) {
        if (pattern.includes(date_pattern))
            pattern = pattern.replace(date_pattern, date.format(replacer[date_pattern]));
    });
    return pattern;
}
exports.parsePermalink = parsePermalink;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGVybWFsaW5rLmpzIiwic291cmNlUm9vdCI6Ii4vc3JjLyIsInNvdXJjZXMiOlsic3JjL3BhcnNlci9wZXJtYWxpbmsudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQUEsK0JBQWdEO0FBQ2hELG9EQUF3RDtBQUN4RCw2REFBc0M7QUFHdEM7OztHQUdHO0FBQ0gsU0FBZ0IsY0FBYyxDQUFDLElBQWE7SUFDMUMsSUFBSSxPQUFPLEdBQVcsaUJBQU0sQ0FBQyxTQUFTLENBQUM7SUFDdkMsSUFBTSxJQUFJLEdBQUcsSUFBQSxnQkFBUyxFQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDM0MsSUFBTSxRQUFRLEdBQUc7UUFDZixRQUFRLEVBQUUsSUFBSTtRQUNkLE9BQU8sRUFBRSxNQUFNO1FBQ2YsTUFBTSxFQUFFLElBQUk7UUFDWixVQUFVLEVBQUUsR0FBRztRQUNmLE9BQU8sRUFBRSxJQUFJO1FBQ2IsU0FBUyxFQUFFLElBQUk7UUFDZixTQUFTLEVBQUUsSUFBSTtRQUNmLFFBQVEsRUFBRSxJQUFBLGdCQUFRLEVBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxTQUFTLENBQUMsQ0FBQyxPQUFPLENBQUMsYUFBYSxFQUFFLEVBQUUsQ0FBQztRQUN0RSxhQUFhLEVBQUUsSUFBSSxDQUFDLFFBQVEsQ0FBQyxLQUFLO0tBQ25DLENBQUM7SUFDRiwwQ0FBMEM7SUFDMUMsSUFBSSxPQUFPLENBQUMsVUFBVSxDQUFDLFFBQVEsQ0FBQyxFQUFFO1FBQ2hDLElBQU0sS0FBSyxHQUFHLE9BQU8sQ0FBQyxPQUFPLENBQUMsUUFBUSxFQUFFLFFBQVEsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDO1FBQzVELElBQU0sSUFBSSxHQUFHLElBQUEsWUFBSSxFQUFDLElBQUEsZUFBTyxFQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsU0FBUyxDQUFDLEVBQUUsS0FBSyxDQUFDLENBQUM7UUFDM0Qsb0JBQW9CO1FBQ3BCLE9BQU8sSUFBSSxDQUFDO0tBQ2I7SUFDRCxNQUFNLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxVQUFDLFlBQVk7UUFDekMsSUFBSSxPQUFPLENBQUMsUUFBUSxDQUFDLFlBQVksQ0FBQztZQUNoQyxPQUFPLEdBQUcsT0FBTyxDQUFDLE9BQU8sQ0FDdkIsWUFBWSxFQUNaLElBQUksQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLFlBQVksQ0FBQyxDQUFDLENBQ3BDLENBQUM7SUFDTixDQUFDLENBQUMsQ0FBQztJQUNILE9BQU8sT0FBTyxDQUFDO0FBQ2pCLENBQUM7QUE3QkQsd0NBNkJDIn0=