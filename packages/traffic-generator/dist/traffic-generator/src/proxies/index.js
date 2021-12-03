"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var proxies_grabber_1 = (0, tslib_1.__importDefault)(require("proxies-grabber"));
require("../../../hexo-seo/packages/js-prototypes/src/Array");
var grabber = new proxies_grabber_1.default();
var list = [];
var deadProxy = [];
var default_1 = /** @class */ (function () {
    function default_1(winx) {
        this.win = winx;
        grabber.get().then(function (px) {
            console.log(px);
            px.forEach(function (prx) {
                list.push(prx);
            });
        });
    }
    default_1.prototype.deleteProxy = function (proxy) {
        deadProxy.push(proxy);
    };
    default_1.prototype.getRandom = function () {
        list = list.shuffle();
        for (var index = 0; index < 40; index++) {
            var proxy = list.random();
            var result = proxy.type + "://" + proxy.proxy;
            if (!deadProxy.includes(result))
                return result;
        }
    };
    return default_1;
}());
exports.default = default_1;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvcHJveGllcy9pbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFDQSxpRkFBMkM7QUFDM0MsOERBQTREO0FBRTVELElBQU0sT0FBTyxHQUFHLElBQUkseUJBQVksRUFBRSxDQUFDO0FBRW5DLElBQUksSUFBSSxHQUFnQixFQUFFLENBQUM7QUFDM0IsSUFBTSxTQUFTLEdBQWEsRUFBRSxDQUFDO0FBRS9CO0lBY0UsbUJBQVksSUFBNEI7UUFDdEMsSUFBSSxDQUFDLEdBQUcsR0FBRyxJQUFJLENBQUM7UUFDaEIsT0FBTyxDQUFDLEdBQUcsRUFBRSxDQUFDLElBQUksQ0FBQyxVQUFDLEVBQUU7WUFDcEIsT0FBTyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsQ0FBQztZQUNoQixFQUFFLENBQUMsT0FBTyxDQUFDLFVBQUMsR0FBRztnQkFDYixJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO1lBQ2pCLENBQUMsQ0FBQyxDQUFDO1FBQ0wsQ0FBQyxDQUFDLENBQUM7SUFDTCxDQUFDO0lBckJELCtCQUFXLEdBQVgsVUFBWSxLQUFhO1FBQ3ZCLFNBQVMsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7SUFDeEIsQ0FBQztJQUNELDZCQUFTLEdBQVQ7UUFDRSxJQUFJLEdBQUcsSUFBSSxDQUFDLE9BQU8sRUFBRSxDQUFDO1FBQ3RCLEtBQUssSUFBSSxLQUFLLEdBQUcsQ0FBQyxFQUFFLEtBQUssR0FBRyxFQUFFLEVBQUUsS0FBSyxFQUFFLEVBQUU7WUFDdkMsSUFBTSxLQUFLLEdBQWMsSUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDO1lBQ3ZDLElBQU0sTUFBTSxHQUFHLEtBQUssQ0FBQyxJQUFJLEdBQUcsS0FBSyxHQUFHLEtBQUssQ0FBQyxLQUFLLENBQUM7WUFDaEQsSUFBSSxDQUFDLFNBQVMsQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDO2dCQUFFLE9BQU8sTUFBTSxDQUFDO1NBQ2hEO0lBQ0gsQ0FBQztJQVlILGdCQUFDO0FBQUQsQ0FBQyxBQXZCRCxJQXVCQyJ9