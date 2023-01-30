"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parse = exports.root = void 0;
var tslib_1 = require("tslib");
var moment_1 = tslib_1.__importDefault(require("moment"));
var xmlbuilder_1 = tslib_1.__importDefault(require("xmlbuilder"));
exports.root = {
    urlset: {
        "@xmlns": "http://www.sitemaps.org/schemas/sitemap/0.9",
        "@xmlns:news": "http://www.google.com/schemas/sitemap-news/0.9",
        "@xmlns:xsi": "http://www.w3.org/2001/XMLSchema-instance",
        "@xsi:schemaLocation": "http://www.sitemaps.org/schemas/sitemap/0.9 http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd http://www.google.com/schemas/sitemap-news/0.9 http://www.google.com/schemas/sitemap-news/0.9/sitemap-news.xsd",
        url: [],
    },
};
var genres = ["Blog", "OpEd", "Opinion", "PressRelease", "Satire", "UserGenerated"];
function parse(prepare) {
    return {
        loc: prepare.loc,
        "news:news": {
            "news:publication": {
                "news:language": prepare.news.publication.language,
                "news:name": prepare.news.publication.name,
            },
            "news:title": prepare.news.title,
            "news:publication_date": prepare.news.publication_date,
        },
    };
}
exports.parse = parse;
var GoogleNewsSitemap = /** @class */ (function () {
    function GoogleNewsSitemap() {
        /**
         * Max 1000 items
         */
        this.items = [];
    }
    /**
     * Reset sitemap data
     */
    GoogleNewsSitemap.prototype.clear = function () {
        this.items.length = 0;
        exports.root.urlset.url.length = 0;
    };
    /**
     * add data to sitemap
     * @param item object information item
     * @returns
     */
    GoogleNewsSitemap.prototype.add = function (item) {
        if (!item.title && !item.publication_name && item.publication_date)
            return;
        var author = "Dimas Lanjaka (Default User)";
        if (typeof item.publication_name == "string") {
            author = item.publication_name;
        }
        else if (typeof item.publication_name == "object") {
            if (item.publication_name.name)
                author = item.publication_name.name;
        }
        var build = {
            loc: item.location,
            news: {
                publication: { name: author, language: item.publication_language || "en" },
                publication_date: item.publication_date || (0, moment_1.default)(new Date(), moment_1.default.ISO_8601).format(GoogleNewsSitemap.date_pattern),
                title: item.title,
                genres: item.genres || "Blog",
            },
        };
        if (typeof item.keywords == "string") {
            build.news.keywords = item.keywords;
        }
        else if (Array.isArray(item.keywords)) {
            build.news.keywords = item.keywords.join(",");
        }
        exports.root.urlset.url.push(parse(build));
        this.items.push(build);
        return build;
    };
    /**
     * get total sitemap data
     * @returns
     */
    GoogleNewsSitemap.prototype.getTotal = function () {
        return this.items.length;
    };
    /**
     * turn all data to xml string
     * @returns
     */
    GoogleNewsSitemap.prototype.toString = function () {
        return xmlbuilder_1.default.create(exports.root, { version: "1.0", encoding: "UTF-8" }).end({ pretty: true });
    };
    GoogleNewsSitemap.date_pattern = "YYYY-MM-DDTHH:mm:ssZ";
    return GoogleNewsSitemap;
}());
exports.default = GoogleNewsSitemap;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7OztBQUFBLDBEQUE0QjtBQUM1QixrRUFBb0M7QUFHdkIsUUFBQSxJQUFJLEdBQUc7SUFDbEIsTUFBTSxFQUFFO1FBQ04sUUFBUSxFQUFFLDZDQUE2QztRQUN2RCxhQUFhLEVBQUUsZ0RBQWdEO1FBQy9ELFlBQVksRUFBRSwyQ0FBMkM7UUFDekQscUJBQXFCLEVBQ25CLG9OQUFvTjtRQUN0TixHQUFHLEVBQUUsRUFBRTtLQUNSO0NBQ0YsQ0FBQztBQUdGLElBQU0sTUFBTSxHQUFHLENBQUMsTUFBTSxFQUFFLE1BQU0sRUFBRSxTQUFTLEVBQUUsY0FBYyxFQUFFLFFBQVEsRUFBRSxlQUFlLENBQVUsQ0FBQztBQStCL0YsU0FBZ0IsS0FBSyxDQUFDLE9BQWlCO0lBQ3JDLE9BQU87UUFDTCxHQUFHLEVBQUUsT0FBTyxDQUFDLEdBQUc7UUFDaEIsV0FBVyxFQUFFO1lBQ1gsa0JBQWtCLEVBQUU7Z0JBQ2xCLGVBQWUsRUFBRSxPQUFPLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxRQUFRO2dCQUNsRCxXQUFXLEVBQUUsT0FBTyxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsSUFBSTthQUMzQztZQUNELFlBQVksRUFBRSxPQUFPLENBQUMsSUFBSSxDQUFDLEtBQUs7WUFDaEMsdUJBQXVCLEVBQUUsT0FBTyxDQUFDLElBQUksQ0FBQyxnQkFBZ0I7U0FDdkQ7S0FDRixDQUFDO0FBQ0osQ0FBQztBQVpELHNCQVlDO0FBa0REO0lBQUE7UUFDRTs7V0FFRztRQUNILFVBQUssR0FBZSxFQUFFLENBQUM7SUF3RHpCLENBQUM7SUF0REM7O09BRUc7SUFDSCxpQ0FBSyxHQUFMO1FBQ0UsSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDO1FBQ3RCLFlBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLE1BQU0sR0FBRyxD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