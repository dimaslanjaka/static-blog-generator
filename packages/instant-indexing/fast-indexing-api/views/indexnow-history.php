<?php
/**
 * IndexNow History page contents.
 *
 * @package Instant Indexing
 */

?>
<div class="wrap rank-math-wrap">
	<h1><?php esc_attr_e( 'IndexNow History', 'fast-indexing-api' ); ?></h1>
	<p class="description"><?php esc_attr_e( 'Here you can see a list of the most recent IndexNow URL submissions, and their status. To clear all items, scroll down to the bottom of the page and click on the "Clear History" button.', 'fast-indexing-api' ); ?></p>

	<?php

	$history_content  = '';
	$history_content .= '<div class="clear"></div>';
	$history_content .= '<table class="wp-list-table widefat striped" id="indexnow_history"><thead><tr><th class="col-date">' . esc_html__( 'Time', 'fast-indexing-api' ) . '</th><th class="col-url">' . esc_html__( 'URL', 'fast-indexing-api' ) . '</th><th class="col-status">' . esc_html__( 'Submission', 'fast-indexing-api' ) . '</th><th class="col-status">' . esc_html__( 'Response', 'fast-indexing-api' ) . '</th></tr></thead><tbody>';

	$result = get_option( 'rank_math_indexnow_log', [] );
	foreach ( $result as $key => $value ) {
		$result[ $key ]['timeFormatted'] = wp_date( 'Y-m-d H:i:s', $value['time'] );
		// Translators: placeholder is human-readable time, e.g. "1 hour".
		$result[ $key ]['timeHumanReadable'] = sprintf( __( '%s ago', 'fast-indexing-api' ), human_time_diff( $value['time'] ) );
	}
	$result = array_values( array_reverse( $result ) );
	if ( ! empty( $result ) ) {
		$type = [
			esc_html__( 'Automatic', 'fast-indexing-api' ),
			esc_html__( 'Manual', 'fast-indexing-api' ),
		];
		foreach ( $result as $value ) {
			$history_content .= '<tr class="' . ( ! empty( $value['manual_submission'] ) ? 'manual' : 'auto' ) . '"><td class="col-date">' . $value['timeFormatted'] . '<br /><span class="time-human-readable">' . $value['timeHumanReadable'] . '</span></td><td class="col-url">' . $value['url'] . '</td><td class="col-status">' . $type[ (int) $value['manual_submission'] ] . '</td><td class="col-status">' . $value['status'] . '</td></tr>';
		}
	} else {
		$history_content .= '<tr><td colspan="4">' . esc_html__( 'No submissions yet.', 'fast-indexing-api' ) . '</td></tr>';
	}

	$history_content .= '</tbody></table>';

	echo wp_kses_post( $history_content );

	// Print a clear history button.
	$clear_history_args = [
		'clear_indexnow_history' => '1',
		'_wpnonce' => wp_create_nonce( 'giapi_clear_history' )
	];
	echo '<p><a href="' . esc_url( add_query_arg( $clear_history_args ) ) . '" id="indexnow_clear_history" class="button alignright">' . esc_html__( 'Clear History', 'fast-indexing-api' ) . '</a></p>';

	$help_contents = '';

	$help_contents .= '<a href="#" id="indexnow_show_response_codes">' . esc_html__( 'IndexNow Response Code Help', 'fast-indexing-api' ) . '<span class="dashicons dashicons-arrow-down"></span></a>';

	$help_contents .= '<table class="wp-list-table widefat striped hidden" id="indexnow_response_codes"><thead><tr><th class="col-response-code">' . esc_html__( 'Response Code', 'fast-indexing-api' ) . '</th><th class="col-response-message">' . esc_html__( 'Response Message', 'fast-indexing-api' ) . '</th><th class="col-reasons">' . esc_html__( 'Reasons', 'fast-indexing-api' ) . '</th></tr></thead><tbody>';
	$help_contents .= '<tr><td class="col-response-code">200</td><td class="col-response-message">' . esc_html__( 'OK', 'fast-indexing-api' ) . '</td><td class="col-reasons">' . esc_html__( 'The URL was successfully submitted to the IndexNow API.', 'fast-indexing-api' ) . '</td></tr>';
	$help_contents .= '<tr><td class="col-response-code">202</td><td class="col-response-message">' . esc_html__( 'Accepted', 'fast-indexing-api' ) . '</td><td class="col-reasons">' . esc_html__( 'The URL was successfully submitted to the IndexNow API, but the API key will be checked later.', 'fast-indexing-api' ) . '</td></tr>';
	$help_contents .= '<tr><td class="col-response-code">400</td><td class="col-response-message">' . esc_html__( 'Bad Request', 'fast-indexing-api' ) . '</td><td class="col-reasons">' . esc_html__( 'The request was invalid.', 'fast-indexing-api' ) . '</td></tr>';
	$help_contents .= '<tr><td class="col-response-code">403</td><td class="col-response-message">' . esc_html__( 'Forbidden', 'fast-indexing-api' ) . '</td><td class="col-reasons">' . esc_html__( 'The key was invalid (e.g. key not found, file found but key not in the file).', 'fast-indexing-api' ) . '</td></tr>';
	$help_contents .= '<tr><td class="col-response-code">422</td><td class="col-response-message">' . esc_html__( 'Unprocessable Entity', 'fast-indexing-api' ) . '</td><td class="col-reasons">' . esc_html__( 'The URLs don\'t belong to the host or the key is not matching the schema in the protocol.', 'fast-indexing-api' ) . '</td></tr>';
	$help_contents .= '<tr><td class="col-response-code">429</td><td class="col-response-message">' . esc_html__( 'Too Many Requests', 'fast-indexing-api' ) . '</td><td class="col-reasons">' . esc_html__( 'Too Many Requests (potential Spam).', 'fast-indexing-api' ) . '</td></tr>';
	$help_contents .= '</tbody></table>';

	echo wp_kses_post( $help_contents );

	?>

</div>
