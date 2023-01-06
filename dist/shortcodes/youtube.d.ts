/**
 * Parse shortcode youtube
 * * `{% youtube video_id [type] [cookie] %}` will compiled to `<div class="video-container"><iframe src="youtube url"></iframe></div>`
 */
export declare function shortcodeYoutube(content: string): string;
