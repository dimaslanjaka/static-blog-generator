// minifyOnSave
jQuery(document).ready(function($) {
	var $responseTextarea = $('#giapi-response');
	var $submitButton = $('#giapi-submit');
	var $urlField = $('#giapi-url');
	var $actionRadio = $('.giapi-action');
	var $ufResponse = $('#giapi-response-userfriendly');
	var logResponse = function( info, url, api_action ) {
		var d = new Date();
		var n = d.toLocaleTimeString();
		var urls = $urlField.val().split('\n').filter(Boolean);
		var urls_str = urls[0];
		var is_batch = false;
		var action = $actionRadio.filter(':checked').val();
		if ( urls.length > 1 ) {
			urls_str = '(batch)';
			is_batch = true;
		}

		var action_label = action;
		if ( 'bing_submit' === action ) {
			action_label = 'indexnow_submit';
		}

		$ufResponse.removeClass('not-ready fail success').addClass('ready').find('.response-id').html('<strong>' + action_label + '</strong>' + ' ' + urls_str);
		if ( api_action !== 'bing_submit' ) {
			if ( ! is_batch ) {
				if ( typeof info.error !== 'undefined' ) {
					$ufResponse.addClass('fail').find('.response-status').text(rm_giapi.l10n_error+' '+info.error.code).siblings('.response-message').text(info.error.message);
				} else {
					var base = info;
					if ( typeof info.urlNotificationMetadata !== 'undefined' ) {
						base = info.urlNotificationMetadata;
					}
					var d = new Date(base.latestUpdate.notifyTime);
					$ufResponse.addClass('success').find('.response-status').text(rm_giapi.l10n_success+' ').siblings('.response-message').text(rm_giapi.l10n_last_updated+' ' + d.toString());
				}
			} else {
				$ufResponse.addClass('success').find('.response-status').text(rm_giapi.l10n_success+' ').siblings('.response-message').text(rm_giapi.l10n_see_response);
				if ( typeof info.error !== 'undefined' ) {
					$ufResponse.addClass('fail').find('.response-status').text(rm_giapi.l10n_error+' '+info.error.code).siblings('.response-message').text(info.error.message);
				} else {
					$.each(info, function(index, val) {
						if ( typeof val.error !== 'undefined' ) {
							var error_code = '';
							if ( typeof val.error.code !== 'undefined' ) {
								error_code = val.error.code;
							}
							var error_message = '';
							if ( typeof val.error.message !== 'undefined' ) {
								error_message = val.error.message;
							}
							$ufResponse.addClass('fail').find('.response-status').text(rm_giapi.l10n_error+' '+error_code).siblings('.response-message').text(val.error.message);
						}
					});
				}
			}
		} else {
			// Bing URL submission API.
			if ( typeof info.error !== 'undefined' ) {
				$ufResponse.addClass('fail').find('.response-status').text(rm_giapi.l10n_error+' '+info.error.code).siblings('.response-message').text(info.error.message);
			} else {
				$ufResponse.addClass('success').find('.response-status').text(rm_giapi.l10n_success+' ').siblings('.response-message').text(rm_giapi.l10n_see_response);
			}

			action = 'indexnow_submit';
		}

		var rawdata = n + " " + action + ": " + urls_str + "\n" + JSON.stringify(info, null, 2) + "\n" + "-".repeat(56);
		var current = $responseTextarea.val();
		$responseTextarea.val(rawdata + "\n" + current);
	};

	$('#giapi-response-trigger').click(function(e) {
			e.preventDefault();
			$(this).find('.dashicons').toggleClass('dashicons-arrow-down-alt2 dashicons-arrow-up-alt2')
			$('#giapi-response-wrapper').toggle();
	});

	$('#instant-indexing').submit(function(event) {
		event.preventDefault();
		$submitButton.attr('disabled', 'disabled');
		var input_url = $urlField.val();
		var api_action = $actionRadio.filter(':checked').val();
		var nonce = $('#_wpnonce').val();
		$.ajax({
			url: ajaxurl,
			type: 'POST',
			dataType: 'json',
			data: { action: 'rm_giapi', url: input_url, api_action: api_action, _wpnonce: nonce },
		}).always(function(data) {
			logResponse( data, input_url, api_action );
			$submitButton.removeAttr('disabled');
			$.ajax({
				url: ajaxurl,
				type: 'POST',
				dataType: 'json',
				data: { action: 'rm_giapi_limits', _wpnonce: nonce },
			})
			.done(function( data ) {
				$.each( data, function(index, val) {
					$('#giapi-limit-'+index).text(val);
				});
			});
		});
	});

	if ( rm_giapi.submit_onload ) {
		$('#instant-indexing').submit();
	}

	$( '#indexnow_show_response_codes' ).on( 'click', function( e ) {
		e.preventDefault();
		$( this ).toggleClass( 'active' );
		$( '#indexnow_response_codes' ).toggleClass( 'hidden' );
	});

	$('#indexnow_reset_key').on( 'click', function( e ) {
		e.preventDefault();
		let originalValue = $( '#giapi_indexnow_api_key' ).val();
		$( '#giapi_indexnow_api_key' ).val( '...' );
		$.ajax( {
			url: rankMath.indexNow.restUrl + '/resetKey',
			type: 'POST',
			beforeSend( xhr ) {
				xhr.setRequestHeader( 'X-WP-Nonce', rankMath.api.nonce );
			},
			success: function( response ) {
				$( '#giapi_indexnow_api_key' ).val( response.key );
				$( '#indexnow_api_key_location').text( response.location );
				$( '#indexnow_check_key' ).attr( 'href', response.location );
			},
			error: function( response ) {
				$( '#giapi_indexnow_api_key' ).val( originalValue )
			},
		} )
	} )
	
});

jQuery(window).on('load', function() {
	jQuery('#giapi-submit').prop('disabled', false);
});
