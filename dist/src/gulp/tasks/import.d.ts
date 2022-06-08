export interface WPPost {
    title: string;
    link: string;
    pubDate: string;
    'dc:creator': string;
    guid: string;
    description: string;
    'content:encoded': string;
    'excerpt:encoded': string;
    'wp:post_id': number;
    'wp:post_date': string;
    'wp:post_date_gmt': string;
    'wp:post_modified': string;
    'wp:post_modified_gmt': string;
    'wp:comment_status': string;
    'wp:ping_status': string;
    'wp:post_name': string;
    'wp:status': string;
    'wp:post_parent': number;
    'wp:menu_order': number;
    'wp:post_type': string | 'page' | 'post';
    'wp:post_password': string;
    'wp:is_sticky': number;
    'wp:postmeta': WPPostmeta;
}
export interface WPPostmeta {
    'wp:meta_key': string;
    'wp:meta_value': number;
}
