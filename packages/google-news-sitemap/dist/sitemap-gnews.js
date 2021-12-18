"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var xml_1 = (0, tslib_1.__importDefault)(require("xml"));
var GoogleNewsSitemap = /** @class */ (function () {
    function GoogleNewsSitemap(options, items) {
        this.items = [];
        options = options || {};
        this.publication_name = options.publication_name || "Untitled News";
        this.publication_language = options.publication_language || "en";
        this.access = options.access;
        this.genres = options.genres;
        this.items = items || [];
    }
    GoogleNewsSitemap.prototype.item = function (options) {
        var item = {
            location: options.location,
            publication_name: options.publication_name || this.publication_name,
            publication_language: options.publication_language || this.publication_language,
            access: options.access || this.access,
            genres: options.genres || this.genres,
            publication_date: options.publication_date,
            title: options.title,
            geo_locations: options.geo_locations,
            keywords: options.keywords,
            stock_tickers: options.stock_tickers,
        };
        this.items.push(item);
        return this;
    };
    GoogleNewsSitemap.prototype.xml = function (indent) {
        return '<?xml version="1.0" encoding="UTF-8"?>\n' + (0, xml_1.default)(generateXML(this), indent);
    };
    return GoogleNewsSitemap;
}());
exports.default = GoogleNewsSitemap;
function formatDate(date) {
    var fmt = date.toISOString();
    fmt = fmt.slice(0, fmt.indexOf("T") + 1);
    fmt = fmt + date.toTimeString().replace(" GMT", "");
    fmt = fmt.slice(0, 22) + ":00";
    return fmt;
}
function generateXML(data) {
    var urlset = [
        {
            _attr: {
                xmlns: "http://www.sitemaps.org/schemas/sitemap/0.9",
                "xmlns:news": "http://www.google.com/schemas/sitemap-news/0.9",
            },
        },
    ];
    data.items.forEach(function (item) {
        var news_values = [
            { "news:publication": [{ "news:name": item.publication_name }, { "news:language": item.publication_language }] },
        ];
        var url_values = [{ _attr: {} }, { loc: item.location }, { "news:news": news_values }];
        urlset.push({ url: url_values });
        /*
         const news_values = [
          { "news:publication": [{ "news:name": item.publication_name }, { "news:language": item.publication_language }] },
        ];
        if (item.access) news_values.push({ "news:access": item.access });
        if (item.genres) news_values.push({ "news:genres": item.genres });
        if (item.publication_date) news_values.push({ "news:publication_date": formatDate(item.publication_date) });
        if (item.title) news_values.push({ "news:title": item.title });
        if (item.geo_locations) news_values.push({ "news:geo_locations": item.geo_locations });
        if (item.keywords) news_values.push({ "news:keywords": item.keywords });
        if (item.stock_tickers) news_values.push({ "news:stock_tickers": item.stock_tickers });
    
        const url_values = [{ _attr: {} }, { loc: item.location }, { "news:news": news_values }];
    
        urlset.push({ url: url_values });*/
    });
    return { urlset: urlset };
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2l0ZW1hcC1nbmV3cy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy9zaXRlbWFwLWduZXdzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLHlEQUFzQjtBQWV0QjtJQVlFLDJCQUNFLE9BQTJGLEVBQzNGLEtBQWtCO1FBSHBCLFVBQUssR0FBZSxFQUFFLENBQUM7UUFLckIsT0FBTyxHQUFHLE9BQU8sSUFBSSxFQUFFLENBQUM7UUFFeEIsSUFBSSxDQUFDLGdCQUFnQixHQUFHLE9BQU8sQ0FBQyxnQkFBZ0IsSUFBSSxlQUFlLENBQUM7UUFDcEUsSUFBSSxDQUFDLG9CQUFvQixHQUFHLE9BQU8sQ0FBQyxvQkFBb0IsSUFBSSxJQUFJLENBQUM7UUFDakUsSUFBSSxDQUFDLE1BQU0sR0FBRyxPQUFPLENBQUMsTUFBTSxDQUFDO1FBQzdCLElBQUksQ0FBQyxNQUFNLEdBQUcsT0FBTyxDQUFDLE1BQU0sQ0FBQztRQUU3QixJQUFJLENBQUMsS0FBSyxHQUFHLEtBQUssSUFBSSxFQUFFLENBQUM7SUFDM0IsQ0FBQztJQUNELGdDQUFJLEdBQUosVUFBSyxPQUFpQjtRQUNwQixJQUFNLElBQUksR0FBYTtZQUNyQixRQUFRLEVBQUUsT0FBTyxDQUFDLFFBQVE7WUFDMUIsZ0JBQWdCLEVBQUUsT0FBTyxDQUFDLGdCQUFnQixJQUFJLElBQUksQ0FBQyxnQkFBZ0I7WUFDbkUsb0JBQW9CLEVBQUUsT0FBTyxDQUFDLG9CQUFvQixJQUFJLElBQUksQ0FBQyxvQkFBb0I7WUFDL0UsTUFBTSxFQUFFLE9BQU8sQ0FBQyxNQUFNLElBQUksSUFBSSxDQUFDLE1BQU07WUFDckMsTUFBTSxFQUFFLE9BQU8sQ0FBQyxNQUFNLElBQUksSUFBSSxDQUFDLE1BQU07WUFDckMsZ0JBQWdCLEVBQUUsT0FBTyxDQUFDLGdCQUFnQjtZQUMxQyxLQUFLLEVBQUUsT0FBTyxDQUFDLEtBQUs7WUFDcEIsYUFBYSxFQUFFLE9BQU8sQ0FBQyxhQUFhO1lBQ3BDLFFBQVEsRUFBRSxPQUFPLENBQUMsUUFBUTtZQUMxQixhQUFhLEVBQUUsT0FBTyxDQUFDLGFBQWE7U0FDckMsQ0FBQztRQUVGLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQ3RCLE9BQU8sSUFBSSxDQUFDO0lBQ2QsQ0FBQztJQUNELCtCQUFHLEdBQUgsVUFBSSxNQUE2QztRQUMvQyxPQUFPLDBDQUEwQyxHQUFHLElBQUEsYUFBRyxFQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsRUFBRSxNQUFNLENBQUMsQ0FBQztJQUNyRixDQUFDO0lBQ0gsd0JBQUM7QUFBRCxDQUFDLEFBN0NELElBNkNDOztBQXFCRCxTQUFTLFVBQVUsQ0FBQyxJQUFVO0lBQzVCLElBQUksR0FBRyxHQUFHLElBQUksQ0FBQyxXQUFXLEVBQUUsQ0FBQztJQUM3QixHQUFHLEdBQUcsR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFDLEVBQUUsR0FBRyxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztJQUN6QyxHQUFHLEdBQUcsR0FBRyxHQUFHLElBQUksQ0FBQyxZQUFZLEVBQUUsQ0FBQyxPQUFPLENBQUMsTUFBTSxFQUFFLEVBQUUsQ0FBQyxDQUFDO0lBQ3BELEdBQUcsR0FBRyxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsR0FBRyxLQUFLLENBQUM7SUFDL0IsT0FBTyxHQUFHLENBQUM7QUFDYixDQUFDO0FBRUQsU0FBUyxXQUFXLENBQUMsSUFBdUI7SUFDMUMsSUFBTSxNQUFNLEdBQUc7UUFDYjtZQUNFLEtBQUssRUFBRTtnQkFDTCxLQUFLLEVBQUUsNkNBQTZDO2dCQUNwRCxZQUFZLEVBQUUsZ0RBQWdEO2FBQy9EO1NBQ0Y7S0FDRixDQUFDO0lBRUYsSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsVUFBVSxJQUFJO1FBQy9CLElBQU0sV0FBVyxHQUFHO1lBQ2xCLEVBQUUsa0JBQWtCLEVBQUUsQ0FBQyxFQUFFLFdBQVcsRUFBRSxJQUFJLENBQUMsZ0JBQWdCLEVBQUUsRUFBRSxFQUFFLGVBQWUsRUFBRSxJQUFJLENBQUMsb0JBQW9CLEVBQUUsQ0FBQyxFQUFFO1NBQ2pILENBQUM7UUFDRixJQUFNLFVBQVUsR0FBRyxDQUFDLEVBQUUsS0FBSyxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsR0FBRyxFQUFFLElBQUksQ0FBQyxRQUFRLEVBQUUsRUFBRSxFQUFFLFdBQVcsRUFBRSxXQUFXLEVBQUUsQ0FBQyxDQUFDO1FBQ3pGLE1BQU0sQ0FBQyxJQUFJLENBQUMsRUFBRSxHQUFHLEVBQUUsVUFBVSxFQUFFLENBQUMsQ0FBQztRQUNqQzs7Ozs7Ozs7Ozs7Ozs7MkNBY21DO0lBQ3JDLENBQUMsQ0FBQyxDQUFDO0lBRUgsT0FBTyxFQUFFLE1BQU0sRUFBRSxNQUFNLEVBQUUsQ0FBQztBQUM1QixDQUFDIn0=