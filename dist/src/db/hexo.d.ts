import { postMap } from '../parser/post/parsePost';
import { HexoDBType } from './hexo-data';
export declare class HexoDB {
    addPost(obj: postMap): void;
    get(): HexoDBType;
    save(): void;
}
