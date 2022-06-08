import { postMap } from '../parser/post/parsePost';
import { HexoDBType } from './hexo-data';
export declare const HexoDBPath: string;
export declare class HexoDB {
    parse: HexoDBType;
    constructor();
    addPost(obj: postMap): void;
    get(): HexoDBType;
    save(): void;
    /**
     * dump
     */
    simplify(): void[];
}
