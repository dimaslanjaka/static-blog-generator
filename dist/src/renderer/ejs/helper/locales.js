"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.get_locale = void 0;
var localeMap = {
    en: 'en_US',
    de: 'de_DE',
    es: 'es_ES',
    fr: 'fr_FR',
    hu: 'hu_HU',
    id: 'id_ID',
    it: 'it_IT',
    ja: 'ja_JP',
    ko: 'ko_KR',
    nl: 'nl_NL',
    ru: 'ru_RU',
    th: 'th_TH',
    tr: 'tr_TR',
    vi: 'vi_VN'
};
function get_locale(page) {
    var str = '';
    if (typeof page == 'string') {
        str = page;
    }
    else {
        str = page.lang || page.language || 'en';
    }
    if (str.length === 2 && localeMap[str])
        return localeMap[str];
    if (str.length === 5) {
        var territory = [];
        if (str.includes('-')) {
            territory = str.split('-');
        }
        else {
            territory = str.split('_');
        }
        if (territory.length === 2)
            return territory[0].toLowerCase() + '_' + territory[1].toUpperCase();
    }
    return 'en';
}
exports.get_locale = get_locale;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibG9jYWxlcy5qcyIsInNvdXJjZVJvb3QiOiIuL3NyYy8iLCJzb3VyY2VzIjpbInNyYy9yZW5kZXJlci9lanMvaGVscGVyL2xvY2FsZXMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBRUEsSUFBTSxTQUFTLEdBQUc7SUFDaEIsRUFBRSxFQUFFLE9BQU87SUFDWCxFQUFFLEVBQUUsT0FBTztJQUNYLEVBQUUsRUFBRSxPQUFPO0lBQ1gsRUFBRSxFQUFFLE9BQU87SUFDWCxFQUFFLEVBQUUsT0FBTztJQUNYLEVBQUUsRUFBRSxPQUFPO0lBQ1gsRUFBRSxFQUFFLE9BQU87SUFDWCxFQUFFLEVBQUUsT0FBTztJQUNYLEVBQUUsRUFBRSxPQUFPO0lBQ1gsRUFBRSxFQUFFLE9BQU87SUFDWCxFQUFFLEVBQUUsT0FBTztJQUNYLEVBQUUsRUFBRSxPQUFPO0lBQ1gsRUFBRSxFQUFFLE9BQU87SUFDWCxFQUFFLEVBQUUsT0FBTztDQUNaLENBQUM7QUFFRixTQUFnQixVQUFVLENBQUMsSUFBa0M7SUFDM0QsSUFBSSxHQUFHLEdBQUcsRUFBRSxDQUFDO0lBQ2IsSUFBSSxPQUFPLElBQUksSUFBSSxRQUFRLEVBQUU7UUFDM0IsR0FBRyxHQUFHLElBQUksQ0FBQztLQUNaO1NBQU07UUFDTCxHQUFHLEdBQUcsSUFBSSxDQUFDLElBQUksSUFBSSxJQUFJLENBQUMsUUFBUSxJQUFJLElBQUksQ0FBQztLQUMxQztJQUNELElBQUksR0FBRyxDQUFDLE1BQU0sS0FBSyxDQUFDLElBQUksU0FBUyxDQUFDLEdBQUcsQ0FBQztRQUFFLE9BQU8sU0FBUyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0lBQzlELElBQUksR0FBRyxDQUFDLE1BQU0sS0FBSyxDQUFDLEVBQUU7UUFDcEIsSUFBSSxTQUFTLEdBQUcsRUFBRSxDQUFDO1FBQ25CLElBQUksR0FBRyxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsRUFBRTtZQUNyQixTQUFTLEdBQUcsR0FBRyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQztTQUM1QjthQUFNO1lBQ0wsU0FBUyxHQUFHLEdBQUcsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUM7U0FDNUI7UUFFRCxJQUFJLFNBQVMsQ0FBQyxNQUFNLEtBQUssQ0FBQztZQUN4QixPQUFPLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxXQUFXLEVBQUUsR0FBRyxHQUFHLEdBQUcsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLFdBQVcsRUFBRSxDQUFDO0tBQ3hFO0lBQ0QsT0FBTyxJQUFJLENBQUM7QUFDZCxDQUFDO0FBcEJELGdDQW9CQyJ9