"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fs_extra_1 = require("fs-extra");
var upath_1 = require("upath");
// generate empty config if not exists
[
    (0, upath_1.join)(__dirname, 'types/_config_project.json'),
    (0, upath_1.join)(__dirname, 'types/_config_theme.json'),
    (0, upath_1.join)(__dirname, 'types/_config_hashes.json')
].forEach(function (path) {
    if (!(0, fs_extra_1.existsSync)(path)) {
        (0, fs_extra_1.writeFileSync)(path, '{}');
    }
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYV9mb2xkZXJfc29sdmVyLmpzIiwic291cmNlUm9vdCI6Ii4vc3JjLyIsInNvdXJjZXMiOlsic3JjL2FfZm9sZGVyX3NvbHZlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLHFDQUFxRDtBQUNyRCwrQkFBNkI7QUFFN0Isc0NBQXNDO0FBQ3RDO0lBQ0UsSUFBQSxZQUFJLEVBQUMsU0FBUyxFQUFFLDRCQUE0QixDQUFDO0lBQzdDLElBQUEsWUFBSSxFQUFDLFNBQVMsRUFBRSwwQkFBMEIsQ0FBQztJQUMzQyxJQUFBLFlBQUksRUFBQyxTQUFTLEVBQUUsMkJBQTJCLENBQUM7Q0FDN0MsQ0FBQyxPQUFPLENBQUMsVUFBQyxJQUFJO0lBQ2IsSUFBSSxDQUFDLElBQUEscUJBQVUsRUFBQyxJQUFJLENBQUMsRUFBRTtRQUNyQixJQUFBLHdCQUFhLEVBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxDQUFDO0tBQzNCO0FBQ0gsQ0FBQyxDQUFDLENBQUMifQ==