"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
// https://translate.google.co.id/translate?hl=id&sl=en&tl=id&u=http://webmanajemen.com
// https://translate.googleusercontent.com/translate_c?depth=3&nv=1&ie=UTF8&rurl=translate.google.com&sl=en&hl=en&tl=id&u=
(async () => {
    try {
        const { data, config } = await axios_1.default.get("https://translate.google.co.id/translate?hl=id&sl=en&tl=id&u=http://webmanajemen.com");
        console.log(config);
    }
    catch (error) {
        if (axios_1.default.isAxiosError(error)) {
            console.log("axios error", error);
        }
        else {
            console.log("unexpected error", error);
        }
    }
})();
//# sourceMappingURL=traslate.google.js.map