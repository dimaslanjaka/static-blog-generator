"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function default_1(win) {
    win.webContents.session.cookies.get({}).then(function (cookies) {
        console.log(cookies);
    });
}
exports.default = default_1;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvY29va2llcy9pbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLG1CQUF5QixHQUEyQjtJQUNsRCxHQUFHLENBQUMsV0FBVyxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxVQUFDLE9BQU87UUFDbkQsT0FBTyxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsQ0FBQztJQUN2QixDQUFDLENBQUMsQ0FBQztBQUNMLENBQUM7QUFKRCw0QkFJQyJ9