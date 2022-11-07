<?php
/**
 * IndexNow API Settings page contents.
 *
 * @package Instant Indexing
 */

$check_key_label = __( 'Check Key', 'fast-indexing-api' );

// Translators: %s is the words "Check Key".
$field_desc = sprintf( __( 'Use the %1$s button to verify that the key is accessible for search engines. Clicking on it should open the key file in your browser and show the API key.', 'fast-indexing-api' ), '<strong>' . $check_key_label . '</strong>' );

$key_location = $this->rmapi->get_key_location( 'fast-indexing-api_settings' );
$reset_button = '<a href="#" id="indexnow_reset_key" class="button button-secondary large-button"><span class="dashicons dashicons-update"></span> ' . esc_html__( 'Change Key', 'fast-indexing-api' ) . '</a>';
$reset_nonce  = wp_nonce_field( 'rm_giapi_reset_key', 'reset_key_nonce', true, false );
$check_button = '<a href="' . esc_url( $key_location ) . '" id="indexnow_check_key" class="button button-secondary large-button" target="_blank"><span class="dashicons dashicons-search"></span> ' . $check_key_label . '</a>';
?>
<div class="wrap rank-math-wrap">
	<h1><?php esc_attr_e( 'IndexNow API Settings', 'fast-indexing-api' ); ?></h1>
	<p class="description"><?php esc_attr_e( 'The IndexNow API allows you to submit URLs to Bing and Yandex for indexing.', 'fast-indexing-api' ); ?></p>
	<form enctype="multipart/form-data" method="POST" action="">
		<?php wp_nonce_field( 'giapi-save', '_wpnonce', true, true ); ?>
		<table class="form-table">
			<tr valign="top">
				<th scope="row">
					<?php esc_html_e( 'Submit Posts IndexNow:', 'fast-indexing-api' ); ?>
					<p class="description"><?php esc_html_e( 'Submit posts from these post types automatically to the IndexNow API when a post is published or edited.', 'fast-indexing-api' ); ?></p>
				</th>
				<td><?php $this->post_types_checkboxes( 'bing' ); ?></td>
			</tr>
			<tr valign="top">
				<th scope="row">
					<?php esc_html_e( 'API Key:', 'fast-indexing-api' ); ?>
					<p class="description"><?php esc_html_e( 'The IndexNow API key proves the ownership of the site. It is generated automatically. You can change the key if it becomes known to third parties.', 'fast-indexing-api' ); ?></p>
				</th>
				<td>
					<input type="text" class="large-text" id="giapi_indexnow_api_key" readonly="readonly" name="giapi_settings[indexnow_api_key]" value="<?php echo esc_attr( $this->rmapi->get_key() ); ?>">
					<br />
					<?php echo wp_kses_post( $reset_button ); ?>
					<?php echo $reset_nonce; ?>
				</td>
			</tr>
			</tr>
			<tr valign="top">
				<th scope="row">
					<?php esc_html_e( 'API Key Location:', 'fast-indexing-api' ); ?>
					<p class="description"><?php echo wp_kses_post( $field_desc ); ?></p>
				</th>
				<td>
					<code id="indexnow_api_key_location"><?php echo esc_url( $key_location ); ?></code>
					<br />
					<?php echo wp_kses_post( $check_button ); ?>
				</td>
			</tr>
		</table>

		<?php submit_button(); ?>
	</form>
</div>
