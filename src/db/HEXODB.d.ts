declare namespace HEXODB {
    export interface IRootObject {
        meta: IMeta;
        models: IModels;
    }
    export interface IMeta {
        version: number;
        warehouse: string;
    }
    export interface IModels {
        Asset: IAssetItem[];
        Cache: ICacheItem[];
        Category: ICategoryItem[];
        Data: IDataItem[];
        Page: IPageItem[];
        Post: IPostItem[];
        PostAsset: IPostAssetItem[];
        PostCategory: IPostCategoryItem[];
        PostTag: IPostTagItem[];
        Tag: ITagItem[];
    }
    export interface IAssetItem {
        _id: string;
        path: string;
        modified: number;
        renderable: number;
    }
    export interface ICacheItem {
        _id: string;
        hash: string;
        modified: number;
    }
    export interface ICategoryItem {
        name: string;
        _id: string;
        parent?: string;
    }
    export interface IDataItem {
        _id?: string;
        data: IDataItem[] | string[];
        title?: string;
        icon?: string;
        link?: string;
    }
    export interface IPageItem {
        title: string;
        date: string;
        type?: string;
        layout: string;
        _content: string;
        source: string;
        raw: string;
        updated: string;
        path: string;
        comments: number;
        _id: string;
        content: string;
        site: ISite;
        cover: string;
        excerpt: string;
        more: string;
        tags?: string[];
        subtitle?: string;
        adsense?: boolean;
        author?: IAuthor;
        webtitle?: string;
    }
    export interface ISite {
        data: IData;
    }
    export interface IData {
        contact: IContactItem[];
        target: string[];
    }
    export interface IContactItem {
        title: string;
        icon: string;
        link: string;
    }
    export interface IAuthor {
        nick?: string;
        link: string;
        name?: string;
        image?: IImage | string;
        email?: string;
    }
    export interface IPostItem {
        title: string;
        description: string;
        date: string;
        updated: string;
        author: IAuthor;
        comments: number;
        cover: string;
        excerpt: string;
        id: string;
        keywords?: string[];
        lang: string;
        layout: string;
        photos: string[];
        subtitle: string;
        thumbnail?: string;
        toc?: boolean;
        type: string;
        url: string;
        uuid?: string;
        webtitle?: string;
        wordcount: number;
        source: string;
        published: number;
        fileTree: IFileTree;
        _content: string;
        raw: string;
        slug: string;
        __permalink: string;
        link: string;
        _id: string;
        content: string;
        site: ISite;
        more: string;
        location?: string;
        ads?: boolean;
        related_posts?: string[];
        Category?: string[];
        category?: string[];
        canonical?: string;
        redirect?: string;
        redirect_to?: string;
    }
    export interface IImage {
        url: string;
        width: number;
        height: number;
    }
    export interface IFileTree {
        source: string;
        'public': string;
    }
    export interface IPostAssetItem {
        _id: string;
        slug: string;
        post: string;
        modified: number;
        renderable: number;
    }
    export interface IPostCategoryItem {
        post_id: string;
        category_id: string;
        _id: string;
    }
    export interface IPostTagItem {
        post_id: string;
        tag_id: string;
        _id: string;
    }
    export interface ITagItem {
        name: string;
        _id: string;
    }
}

