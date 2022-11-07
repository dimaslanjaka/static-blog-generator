<?php
/**
 * Instant Indexing Settings page contents.
 *
 * @package Instant Indexing
 */

?>
<div class="wrap rank-math-wrap">
	<h1><?php esc_attr_e( 'Google Instant Indexing API Settings', 'fast-indexing-api' ); ?></h1>
	<form enctype="multipart/form-data" method="POST" action="">
		<?php wp_nonce_field( 'giapi-save', '_wpnonce', true, true ); ?>
		<table class="form-table">
			<tr valign="top">
				<th scope="row">
					<?php esc_html_e( 'Google JSON Key:', 'fast-indexing-api' ); ?>
					<p class="description"><?php esc_html_e( 'Upload the Service Account JSON key file you obtained from Google API Console or paste its contents in the field.', 'fast-indexing-api' ); ?></p>
					<div class="setup-guide-link-wrapper"><span class="dashicons dashicons-editor-help"></span> <a href="<?php echo $this->google_guide_url; ?>" target="_blank"><?php esc_html_e( 'Read our setup guide', 'fast-indexing-api' ); ?></a></div>
				</th>
				<td>
					<?php if ( file_exists( plugin_dir_path( __FILE__ ) . 'rank-math-835b6feb842b.json' ) ) { ?>
						<textarea name="giapi_settings[json_key]" class="large-text" rows="8" readonly="readonly"><?php echo esc_textarea( file_get_contents( plugin_dir_path( __FILE__ ) . 'rank-math-835b6feb842b.json' ) ); ?></textarea>
						<br>
						<p class="description"><?php esc_html_e( '<code>rank-math-835b6feb842b.json</code> file found in the plugin folder. You cannot change the JSON key from here until you delete or remame this file.', 'fast-indexing-api' ); ?></p>
					<?php } else { ?>
						<textarea name="giapi_settings[json_key]" class="large-text" rows="8"><?php echo esc_textarea( $this->get_setting( 'json_key' ) ); ?></textarea>
						<br>
						<label>
							<?php esc_html_e( 'Or upload JSON file: ', 'fast-indexing-api' ); ?>
							<input type="file" name="json_file" />
						</label>
					<?php } ?>
				</td>
			</tr>
			<tr valign="top">
				<th scope="row">
					<?php esc_html_e( 'Submit Posts to Google:', 'fast-indexing-api' ); ?>
					<p class="description"><?php esc_html_e( 'Submit posts from these post types automatically to the Google Instant Indexing API when a post is published, edited, or deleted.', 'fast-indexing-api' ); ?></p>
				</th>
				<td><?php $this->post_types_checkboxes(); ?></td>
			</tr>
		</table>

		<?php submit_button(); ?>
	</form>
</div>
