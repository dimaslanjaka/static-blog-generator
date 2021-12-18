"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var xmlbuilder_1 = (0, tslib_1.__importDefault)(require("xmlbuilder"));
var root = {
    urlset: {
        "@type": "git",
        "#text": "git://github.com/oozcitak/xmlbuilder-js.git", // text node
    },
};
var xml = xmlbuilder_1.default.create(root).end({ pretty: true });
console.log(xml);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoieG1sLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL3htbC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSx1RUFBb0M7QUFFcEMsSUFBTSxJQUFJLEdBQUc7SUFDWCxNQUFNLEVBQUU7UUFDTixPQUFPLEVBQUUsS0FBSztRQUNkLE9BQU8sRUFBRSw2Q0FBNkMsRUFBRSxZQUFZO0tBQ3JFO0NBQ0YsQ0FBQztBQUNGLElBQU0sR0FBRyxHQUFHLG9CQUFVLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxFQUFFLE1BQU0sRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFDO0FBQzFELE9BQU8sQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMifQ==