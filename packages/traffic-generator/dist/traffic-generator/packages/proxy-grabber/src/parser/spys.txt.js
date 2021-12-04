"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parser = void 0;
require("../../../../../hexo-seo/packages/js-prototypes/src/Array");
/**
 * Parse data from spys
 * @param data
 * @returns
 */
function parse(data) {
    var result = data
        .split('\n')
        .trim()
        .filter(function (str) {
        if (!str.match(/^\d/)) {
            return false;
        }
        return true;
    })
        .map(function (str) {
        //IP address:Port CountryCode-Anonymity(Noa/Anm/Hia)-SSL_support(S)-Google_passed(+)
        var buildObject = {
            proxy: null,
            code: null,
            anonymity: null,
            ssl: null,
            google: null,
            alert: null,
            type: 'http',
            test: null,
        };
        // [ '79.104.25.218:8080', 'RU-H-S', '-' ]
        var parse = str.split(/\s/);
        buildObject.proxy = parse[0];
        // split country code and anonymity
        if (parse[1].includes('!')) {
            buildObject.alert = true;
            parse[1] = parse[1].replace('!', '');
        }
        else {
            buildObject.alert = false;
        }
        var ctr = parse[1].split('-');
        buildObject.code = ctr[0];
        buildObject.anonymity = ctr[1];
        // if contains `S` is SSL
        if (typeof ctr[2] == 'string')
            buildObject.ssl = true;
        if (parse[2] == '+') {
            buildObject.google = true;
        }
        else {
            buildObject.google = false;
        }
        return buildObject;
    });
    return result;
}
exports.default = parse;
exports.parser = parse;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3B5cy50eHQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9wcm94eS1ncmFiYmVyL3NyYy9wYXJzZXIvc3B5cy50eHQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEsb0VBQWtFO0FBdUNsRTs7OztHQUlHO0FBQ0gsU0FBUyxLQUFLLENBQUMsSUFBWTtJQUN6QixJQUFNLE1BQU0sR0FBZ0IsSUFBSTtTQUM3QixLQUFLLENBQUMsSUFBSSxDQUFDO1NBQ1gsSUFBSSxFQUFFO1NBQ04sTUFBTSxDQUFDLFVBQUMsR0FBRztRQUNWLElBQUksQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxFQUFFO1lBQ3JCLE9BQU8sS0FBSyxDQUFDO1NBQ2Q7UUFDRCxPQUFPLElBQUksQ0FBQztJQUNkLENBQUMsQ0FBQztTQUNELEdBQUcsQ0FBQyxVQUFDLEdBQUc7UUFDUCxvRkFBb0Y7UUFDcEYsSUFBTSxXQUFXLEdBQWM7WUFDN0IsS0FBSyxFQUFFLElBQUk7WUFDWCxJQUFJLEVBQUUsSUFBSTtZQUNWLFNBQVMsRUFBRSxJQUFJO1lBQ2YsR0FBRyxFQUFFLElBQUk7WUFDVCxNQUFNLEVBQUUsSUFBSTtZQUNaLEtBQUssRUFBRSxJQUFJO1lBQ1gsSUFBSSxFQUFFLE1BQU07WUFDWixJQUFJLEVBQUUsSUFBSTtTQUNYLENBQUM7UUFDRiwwQ0FBMEM7UUFDMUMsSUFBTSxLQUFLLEdBQUcsR0FBRyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUM5QixXQUFXLENBQUMsS0FBSyxHQUFHLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUM3QixtQ0FBbUM7UUFDbkMsSUFBSSxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxFQUFFO1lBQzFCLFdBQVcsQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDO1lBQ3pCLEtBQUssQ0FBQyxDQUFDLENBQUMsR0FBRyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLEdBQUcsRUFBRSxFQUFFLENBQUMsQ0FBQztTQUN0QzthQUFNO1lBQ0wsV0FBVyxDQUFDLEtBQUssR0FBRyxLQUFLLENBQUM7U0FDM0I7UUFDRCxJQUFNLEdBQUcsR0FBRyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQ2hDLFdBQVcsQ0FBQyxJQUFJLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQzFCLFdBQVcsQ0FBQyxTQUFTLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQy9CLHlCQUF5QjtRQUN6QixJQUFJLE9BQU8sR0FBRyxDQUFDLENBQUMsQ0FBQyxJQUFJLFFBQVE7WUFBRSxXQUFXLENBQUMsR0FBRyxHQUFHLElBQUksQ0FBQztRQUN0RCxJQUFJLEtBQUssQ0FBQyxDQUFDLENBQUMsSUFBSSxHQUFHLEVBQUU7WUFDbkIsV0FBVyxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUM7U0FDM0I7YUFBTTtZQUNMLFdBQVcsQ0FBQyxNQUFNLEdBQUcsS0FBSyxDQUFDO1NBQzVCO1FBQ0QsT0FBTyxXQUFXLENBQUM7SUFDckIsQ0FBQyxDQUFDLENBQUM7SUFDTCxPQUFPLE1BQU0sQ0FBQztBQUNoQixDQUFDO0FBRUQsa0JBQWUsS0FBSyxDQUFDO0FBQ1IsUUFBQSxNQUFNLEdBQUcsS0FBSyxDQUFDIn0=