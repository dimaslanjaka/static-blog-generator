"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fs_1 = require("fs");
var path_1 = require("path");
// [task] generate empty config if not exists
[
    (0, path_1.join)(__dirname, 'types/_config_project.json'),
    (0, path_1.join)(__dirname, 'types/_config_theme.json'),
    (0, path_1.join)(__dirname, 'types/_config_hashes.json')
].forEach(function (path) {
    if (!(0, fs_1.existsSync)(path)) {
        (0, fs_1.writeFileSync)(path, '{}');
    }
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYS1jb3JlLmpzIiwic291cmNlUm9vdCI6Ii4vc3JjLyIsInNvdXJjZXMiOlsic3JjL2EtY29yZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLHlCQUErQztBQUMvQyw2QkFBNEI7QUFFNUIsNkNBQTZDO0FBQzdDO0lBQ0UsSUFBQSxXQUFJLEVBQUMsU0FBUyxFQUFFLDRCQUE0QixDQUFDO0lBQzdDLElBQUEsV0FBSSxFQUFDLFNBQVMsRUFBRSwwQkFBMEIsQ0FBQztJQUMzQyxJQUFBLFdBQUksRUFBQyxTQUFTLEVBQUUsMkJBQTJCLENBQUM7Q0FDN0MsQ0FBQyxPQUFPLENBQUMsVUFBQyxJQUFJO0lBQ2IsSUFBSSxDQUFDLElBQUEsZUFBVSxFQUFDLElBQUksQ0FBQyxFQUFFO1FBQ3JCLElBQUEsa0JBQWEsRUFBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLENBQUM7S0FDM0I7QUFDSCxDQUFDLENBQUMsQ0FBQyJ9