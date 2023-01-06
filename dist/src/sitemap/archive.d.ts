import Hexo from 'hexo';
interface objectCategoryTags {
    permalink: string;
    name: string;
    latest: string;
}
interface returnCategoryTags {
    tags: objectCategoryTags[];
    categories: objectCategoryTags[];
}
declare function getCategoryTags(hexo: Hexo): returnCategoryTags;
export declare function getLatestFromArrayDates(arr: string[] | Date[]): Date;
export default getCategoryTags;
