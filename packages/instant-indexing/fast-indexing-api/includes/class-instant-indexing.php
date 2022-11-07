<?php
/**
 * Main plugin class.
 *
 * @package Instant Indexing
 * @since 1.0.0
 * @author Rank Math
 * @link https://rankmath.com
 * @license GNU General Public License 3.0+
 */
class RM_GIAPI {

	/**
	 * Plugin version.
	 *
	 * @var string
	 */
	public $version = '1.1.16';

	/**
	 * Holds the admin menu hook suffix for the "dummy" dashboard.
	 *
	 * @var string
	 */
	public $dashboard_menu_hook_suffix = '';

	/**
	 * Holds the admin menu hook suffix for Rank Math > Instant Indexing
	 *
	 * @var string
	 */
	public $menu_hook_suffix = '';

	/**
	 * The default tab when visiting the admin page.
	 *
	 * @var string
	 */
	public $default_nav_tab = '';

	/**
	 * Holds the current admin tab.
	 *
	 * @var string
	 */
	public $current_nav_tab = '';

	/**
	 * Holds the admin tabs.
	 *
	 * @var array
	 */
	public $nav_tabs = [];

	/**
	 * Holds the admin notice messages.
	 *
	 * @var array
	 */
	public $notices = [];

	/**
	 * Holds the default settings.
	 *
	 * @var array
	 */
	public $settings_defaults = [];

	/**
	 * Debug mode. Enable with define( 'GIAPI_DEBUG', true );
	 *
	 * @var bool
	 */
	public $debug = false;

	/**
	 * Check if Rank Math SEO is installed.
	 *
	 * @var bool
	 */
	public $is_rm_active = false;

	/**
	 * Rank Math Instant Indexing API.
	 *
	 * @var object
	 */
	public $rmapi = null;

	/**
	 * URL of the Google plugin setup guide on rankmath.com.
	 *
	 * @var string
	 */
	public $google_guide_url = 'https://rankmath.com/blog/google-indexing-api/?utm_source=Instant+Indexing+Plugin&utm_medium=Setup+Guide+Button&utm_campaign=WP';

	/**
	 * URL of the Bing plugin setup guide on rankmath.com.
	 *
	 * @var string
	 */
	public $bing_guide_url = 'https://rankmath.com/blog/bing-indexing-api/?utm_source=Instant+Indexing+Plugin&utm_medium=Setup+Guide+Button&utm_campaign=WP';

	/**
	 * Constructor method.
	 */
	public function __construct() {
		$this->debug             = ( defined( 'GIAPI_DEBUG' ) && GIAPI_DEBUG );
		$this->is_rm_active      = function_exists( 'rank_math' );

		$this->default_nav_tab   = 'google_settings';
		$this->settings_defaults = [
			'json_key'        => '',
			'post_types'      => [],
			'bing_post_types' => [
				'post' => 'post',
				'page' => 'page',
			],
			'indexnow_api_key' => '',
		];

		$this->nav_tabs = [
			'google_settings' => __( 'Google API Settings', 'fast-indexing-api' ),
			'bing_settings'   => __( 'IndexNow API Settings', 'fast-indexing-api' ),
			'console'         => __( 'Console', 'fast-indexing-api' ),
		];

		if ( $this->is_rm_active && class_exists( 'RankMath\\Instant_Indexing\\Api' ) ) {
			$this->rm_module = new RankMath\Instant_Indexing\Instant_Indexing();
			$this->rmapi = RankMath\Instant_Indexing\Api::get();
			add_action( 'admin_init', [ $this, 'remove_rm_admin_page' ] );
		} else {
			unset( $this->nav_tabs['bing_settings'] );
		}

		if ( $this->get_setting( 'json_key' ) ) {
			$this->nav_tabs['google_settings'] = '<span class="dashicons dashicons-yes-alt"></span> ' . $this->nav_tabs['google_settings'];
			unset( $this->nav_tabs['console'] );
			$this->nav_tabs = [ 'console' => __( 'Console', 'fast-indexing-api' ) ] + $this->nav_tabs;
			$this->default_nav_tab = 'console';
		}

		if ( $this->is_rm_active ) {
			$this->nav_tabs['bing_settings'] = '<span class="dashicons dashicons-yes-alt"></span> ' . $this->nav_tabs['bing_settings'];
			unset( $this->nav_tabs['console'] );
			$this->nav_tabs = [ 'console' => __( 'Console', 'fast-indexing-api' ) ] + $this->nav_tabs;
			$this->default_nav_tab = 'console';
			$this->nav_tabs['indexnow_history'] = __( 'IndexNow History', 'fast-indexing-api' );
		}

		$this->current_nav_tab = $this->default_nav_tab;
		if ( isset( $_GET['tab'] ) && isset( $this->nav_tabs[ $_GET['tab'] ] ) ) {
			$this->current_nav_tab = $_GET['tab']; //phpcs:ignore
		}
		add_action( 'admin_menu', [ $this, 'admin_menu' ], 20 );
		add_action( 'admin_footer', [ $this, 'admin_footer' ], 20 );
		add_action( 'admin_enqueue_scripts', [ $this, 'admin_enqueue_scripts' ] );
		add_action( 'wp_ajax_rm_giapi', [ $this, 'ajax_rm_giapi' ] );
		add_action( 'wp_ajax_rm_giapi_limits', [ $this, 'ajax_get_limits' ] );
		add_action( 'admin_init', [ $this, 'rm_missing_admin_notice_error' ], 20, 1 );
		add_action( 'admin_notices', [ $this, 'display_notices' ], 10, 1 );
		add_action( 'load-rank-math_page_instant-indexing', [ $this, 'save_settings' ], 10, 1 );
		add_filter( 'plugin_action_links_' . RM_GIAPI_FILE, [ $this, 'plugin_action_links' ] );

		if ( $this->get_setting( 'json_key' ) ) {
			$post_types = $this->get_setting( 'post_types', [] );
			foreach ( $post_types as $key => $post_type ) {
				if ( empty( $post_type ) ) {
					continue;
				}
				add_action( 'save_post_' . $post_type, [ $this, 'publish_post' ], 10, 2 );
				add_filter( 'bulk_actions-edit-' . $post_type, [ $this, 'register_bulk_actions' ] );
				add_filter( 'handle_bulk_actions-edit-' . $post_type, [ $this, 'bulk_action_handler' ], 10, 3 );
			}
			add_action( 'trashed_post', [ $this, 'delete_post' ], 10, 1 );
		}

		if ( $this->is_rm_active ) {
			$post_types = $this->get_setting( 'bing_post_types', [] );
			foreach ( $post_types as $key => $post_type ) {
				if ( empty( $post_type ) ) {
					continue;
				}
				add_action( 'save_post_' . $post_type, [ $this, 'bing_publish_post' ], 10, 2 );
				add_filter( 'bulk_actions-edit-' . $post_type, [ $this, 'bing_register_bulk_actions' ] );
				add_filter( 'handle_bulk_actions-edit-' . $post_type, [ $this, 'bing_bulk_action_handler' ], 10, 3 );
			}
		}

		add_filter( 'post_row_actions', [ $this, 'send_to_api_link' ], 10, 2 );
		add_filter( 'page_row_actions', [ $this, 'send_to_api_link' ], 10, 2 );

		// Localization.
		add_action( 'plugins_loaded', [ $this, 'giapi_load_textdomain' ] );

		add_filter( 'rank_math/modules', [ $this, 'filter_modules' ], 25 );

		add_action( 'admin_init', [ $this, 'handle_clear_history' ] );
	}

	/**
	 * Remove Admin page.
	 */
	public function remove_rm_admin_page() {
		remove_submenu_page( 'rank-math', 'rank-math-options-instant-indexing' );
	}

	/**
	 * Register actions for the bulk edit dropdowns on the post listing screen.
	 *
	 * @param  array $bulk_actions Actions.
	 * @return array $bulk_actions
	 */
	public function register_bulk_actions( $bulk_actions ) {
		$bulk_actions['giapi_update']    = __( 'Instant Indexing: Google Update', 'fast-indexing-api' );
		$bulk_actions['giapi_getstatus'] = __( 'Instant Indexing: Google Get Status', 'fast-indexing-api' );

		return $bulk_actions;
	}

	/**
	 * Register additional actions for the bulk edit dropdowns on the post listing screen.
	 *
	 * @param  array $bulk_actions Actions.
	 * @return array $bulk_actions
	 */
	public function bing_register_bulk_actions( $bulk_actions ) {
		$bulk_actions['giapi_bing_submit'] = __( 'Instant Indexing: Bing Submit', 'fast-indexing-api' );

		return $bulk_actions;
	}

	/**
	 * Handle custom bulk actions.
	 *
	 * @param  string $redirect_to The redirect URL.
	 * @param  string $doaction    The action being taken.
	 * @param  array  $post_ids    The items to take the action on.
	 *
	 * @return string $redirect_to The redirect URL.
	 */
	public function bulk_action_handler( $redirect_to, $doaction, $post_ids ) {
		if ( $doaction !== 'giapi_update' && $doaction !== 'giapi_getstatus' ) {
			return $redirect_to;
		}

		$nonce       = wp_create_nonce( 'giapi-action' );
		$redirect_to = add_query_arg(
			[
				'page'      => 'instant-indexing',
				'tab'       => 'console',
				'apiaction' => substr( $doaction, 6 ),
				'apipostid' => $post_ids,
				'_wpnonce'  => $nonce,

			],
			admin_url( 'admin.php' )
		);
		return $redirect_to;
	}

	/**
	 * Handle custom bulk actions.
	 *
	 * @param  string $redirect_to The redirect URL.
	 * @param  string $doaction    The action being taken.
	 * @param  array  $post_ids    The items to take the action on.
	 *
	 * @return string $redirect_to The redirect URL.
	 */
	public function bing_bulk_action_handler( $redirect_to, $doaction, $post_ids ) {
		if ( $doaction !== 'bing_submit' ) {
			return $redirect_to;
		}

		$nonce       = wp_create_nonce( 'giapi-action' );
		$redirect_to = add_query_arg(
			[
				'page'      => 'instant-indexing',
				'tab'       => 'console',
				'apiaction' => substr( $doaction, 6 ),
				'apipostid' => $post_ids,
				'_wpnonce'  => $nonce,

			],
			admin_url( 'admin.php' )
		);
		return $redirect_to;
	}

	/**
	 * Add new action links for the post listing screen.
	 *
	 * @param  array  $actions Current action links.
	 * @param  object $post    WP_Post object.
	 * @return array  $actions New action links.
	 */
	public function send_to_api_link( $actions, $post ) {
		if ( ! current_user_can( apply_filters( 'rank_math/indexing_api/capability', 'manage_options' ) ) ) {
			return $actions;
		}

		if ( $post->post_status !== 'publish' ) {
			return $actions;
		}

		$post_types      = $this->get_setting( 'post_types', [] );
		$bing_post_types = $this->get_setting( 'bing_post_types', [] );
		if ( ! in_array( $post->post_type, $post_types, true ) && ! in_array( $post->post_type, $bing_post_types, true ) ) {
			return $actions;
		}

		$nonce = wp_create_nonce( 'giapi-action' );
		if ( in_array( $post->post_type, $post_types, true ) ) {
			$actions['rmgiapi_update']    = '<a href="' . admin_url( 'admin.php?page=instant-indexing&tab=console&apiaction=update&_wpnonce=' . $nonce . '&apiurl=' . rawurlencode( get_permalink( $post ) ) ) . '" class="rmgiapi-link rmgiapi_update">' . __( 'Instant Indexing: Google Update', 'fast-indexing-api' ) . '</a>';
			$actions['rmgiapi_getstatus'] = '<a href="' . admin_url( 'admin.php?page=instant-indexing&tab=console&apiaction=getstatus&_wpnonce=' . $nonce . '&apiurl=' . rawurlencode( get_permalink( $post ) ) ) . '" class="rmgiapi-link rmgiapi_update">' . __( 'Instant Indexing: Google Get Status', 'fast-indexing-api' ) . '</a>';
		}
		if ( in_array( $post->post_type, $bing_post_types, true ) ) {
			$actions['rmgiapi_bing_submit'] = '<a href="' . admin_url( 'admin.php?page=instant-indexing&tab=console&apiaction=bing_submit&_wpnonce=' . $nonce . '&apiurl=' . rawurlencode( get_permalink( $post ) ) ) . '" class="rmgiapi-link rmgiapi_update">' . __( 'Instant Indexing: Submit to IndexNow', 'fast-indexing-api' ) . '</a>';
		}

		return $actions;
	}

	/**
	 * Load text-domain.
	 *
	 * @return void
	 */
	public function giapi_load_textdomain() {
		load_plugin_textdomain( 'fast-indexing-api', false, dirname( plugin_basename( __FILE__ ) ) . '/languages/' );
	}

	/**
	 * AJAX handler for the console.
	 *
	 * @return void
	 */
	public function ajax_rm_giapi() {
		check_ajax_referer( 'giapi-console' );

		if ( ! current_user_can( apply_filters( 'rank_math/indexing_api/capability', 'manage_options' ) ) ) {
			die( '0' );
		}

		$url_input = $this->get_input_urls();
		$action    = sanitize_title( wp_unslash( $_POST['api_action'] ) );
		header( 'Content-type: application/json' );

		$result = $this->send_to_api( $url_input, $action, true );
		wp_send_json( $result );
		exit();
	}

	/**
	 * Submit one or more URLs to Google's API using their API library.
	 *
	 * @param  array  $url_input URLs.
	 * @param  string $action    API action.
	 * @return array  $data      Result of the API call.
	 */
	public function send_to_api( $url_input, $action, $is_manual = true ) {
		$url_input  = (array) $url_input;
		$urls_count = count( $url_input );

		if ( strpos( $action, 'bing' ) === false ) {
			// This is NOT a Bing API request, so it's Google.
			include_once RM_GIAPI_PATH . 'vendor/autoload.php';
			$this->client = new Google_Client();
			$this->client->setAuthConfig( json_decode( $this->get_setting( 'json_key' ), true ) );
			$this->client->setConfig( 'base_path', 'https://indexing.googleapis.com' );
			$this->client->addScope( 'https://www.googleapis.com/auth/indexing' );

			// Batch request.
			$this->client->setUseBatch( true );
			// init google batch and set root URL.
			$service = new Google_Service_Indexing( $this->client );
			$batch   = new Google_Http_Batch( $this->client, false, 'https://indexing.googleapis.com' );

			foreach ( $url_input as $i => $url ) {
				$post_body = new Google_Service_Indexing_UrlNotification();
				if ( $action === 'getstatus' ) {
					$request_part = $service->urlNotifications->getMetadata( [ 'url' => $url ] ); // phpcs:ignore
				} else {
					$post_body->setType( $action === 'update' ? 'URL_UPDATED' : 'URL_DELETED' );
					$post_body->setUrl( $url );
					$request_part = $service->urlNotifications->publish( $post_body ); // phpcs:ignore
				}
				$batch->add( $request_part, 'url-' . $i );
			}

			$results   = $batch->execute();
			$data      = [];
			$res_count = count( $results );
			foreach ( $results as $id => $response ) {
				// Change "response-url-1" to "url-1".
				$local_id = substr( $id, 9 );
				if ( is_a( $response, 'Google_Service_Exception' ) ) {
					$data[ $local_id ] = json_decode( $response->getMessage() );
				} else {
					$data[ $local_id ] = (array) $response->toSimpleObject();
				}
				if ( $res_count === 1 ) {
					$data = $data[ $local_id ];
				}
			}
		} else {
			// IndexNow submit URL.

			/**
			 * Filter the URL to be submitted to IndexNow.
			 * Returning false will prevent the URL from being submitted.
			 *
			 * @param bool   $is_manual Whether the URL is submitted manually by the user.
			 */
			$url_input = apply_filters( 'rank_math/instant_indexing/submit_url', $url_input, $is_manual );
			if ( ! $url_input ) {
				return false;
			}

			if ( ! $is_manual ) {
				$logs = array_values( array_reverse( $this->rmapi->get_log() ) );
				if ( ! empty( $logs[0] ) && $logs[0]['url'] === $url_input[0] && time() - $logs[0]['time'] < 15 ) {
					return false;
				}
			}

			$request = $this->rmapi->submit( $url_input, $is_manual );
			if ( $request ) {
				$data = [
					'success' => true,
				];
			} else {
				$data = [
					'error' => [
						'code'    => $this->rmapi->get_response_code(),
						'message' => $this->rmapi->get_error(),
					],
				];
			}

			$action = 'indexnow_submit';
		}

		$this->log_request( $action, $urls_count );

		if ( $this->debug ) {
			error_log( 'Rank Math Instant Index: ' . $action . ' ' . $url_input[0] . ( count( $url_input ) > 1 ? ' (+)' : '' ) . "\n" . print_r( $data, true ) ); // phpcs:ignore
		}

		return $data;
	}

	/**
	 * Log request type & timestamp to keep track of remaining quota.
	 *
	 * @param  string $type API action.
	 * @param  int    $number Number of URLs.
	 * @return void
	 */
	public function log_request( $type, $number = 1 ) {
		$requests_log = get_option(
			'giapi_requests',
			[
				'update'      => [],
				'delete'      => [],
				'getstatus'   => [],
				'bing_submit' => [],
			]
		);

		if ( ! isset( $requests_log[ $type ] ) ) {
			$requests_log[ $type ] = [];
		}

		$add = array_fill( 0, $number, time() );
		$requests_log[ $type ] = array_merge( $requests_log[ $type ], $add );
		if ( count( $requests_log[ $type ] ) > 600 ) {
			$requests_log[ $type ] = array_slice( $requests_log[ $type ], -600, 600, true );
		}
		update_option( 'giapi_requests', $requests_log );
	}

	/**
	 * Get current quota (limits minus usage).
	 *
	 * @return array Current quota.
	 */
	public function get_limits() {
		$current_limits = [
			'publishperday' => 0,
			'permin'        => 0,
			'metapermin'    => 0,

			'bing_submitperday' => 0,
		];

		$limit_publishperday = apply_filters( 'rank_math/indexing_api/limit_publishperday', 200 );
		$limit_permin        = apply_filters( 'rank_math/indexing_api/limit_perminute', 600 );
		$limit_metapermin    = apply_filters( 'rank_math/indexing_api/limit_metaperminute', 180 );

		$limit_bingsubmitperday = apply_filters( 'rank_math/indexing_api/limit_bing_submitperday', 10 );

		$requests_log = get_option(
			'giapi_requests',
			[
				'update'      => [],
				'delete'      => [],
				'getstatus'   => [],
				'bing_submit' => [],
			]
		);

		$timestamp_1day_ago = strtotime( '-1 day' );
		$timestamp_1min_ago = strtotime( '-1 minute' );

		$publish_1day = 0;
		$all_1min     = 0;
		$meta_1min    = 0;

		foreach ( $requests_log['update'] as $time ) {
			if ( $time > $timestamp_1day_ago ) {
				$publish_1day++;
			}
			if ( $time > $timestamp_1min_ago ) {
				$all_1min++;
			}
		}
		foreach ( $requests_log['delete'] as $time ) {
			if ( $time > $timestamp_1min_ago ) {
				$all_1min++;
			}
		}
		foreach ( $requests_log['getstatus'] as $time ) {
			if ( $time > $timestamp_1min_ago ) {
				$all_1min++;
				$meta_1min++;
			}
		}

		$bing_submit_1day = 0;
		if ( ! isset( $requests_log['bing_submit'] ) ) {
			$requests_log['bing_submit'] = [];
		}

		foreach ( $requests_log['bing_submit'] as $time ) {
			if ( $time > $timestamp_1day_ago ) {
				$bing_submit_1day++;
			}
		}

		$current_limits['publishperday'] = $limit_publishperday - $publish_1day;
		$current_limits['permin']        = $limit_permin - $all_1min;
		$current_limits['metapermin']    = $limit_metapermin - $meta_1min;

		$current_limits['bing_submitperday'] = $limit_bingsubmitperday - $bing_submit_1day;

		$current_limits['publishperday_max'] = $limit_publishperday;
		$current_limits['permin_max']        = $limit_permin;
		$current_limits['metapermin_max']    = $limit_metapermin;

		$current_limits['bing_submitperday_max'] = $limit_bingsubmitperday;

		return $current_limits;
	}

	/**
	 * AJAX handler to get current quota in JSON format.
	 *
	 * @return void
	 */
	public function ajax_get_limits() {
		check_ajax_referer( 'giapi-console' );

		if ( ! current_user_can( apply_filters( 'rank_math/indexing_api/capability', 'manage_options' ) ) ) {
			die( '0' );
		}

		wp_send_json( $this->get_limits() );
		die();
	}

	/**
	 * Normalize input URLs.
	 *
	 * @return array Input URLs.
	 */
	public function get_input_urls() {
		return array_values( array_filter( array_map( 'trim', array_map( 'esc_url_raw', explode( "\n", wp_unslash( $_POST['url'] ) ) ) ) ) );
	}

	/**
	 * Add admin menu items.
	 *
	 * @return void
	 */
	public function admin_menu() {
		if ( ! class_exists( 'RankMath' ) ) {
			$this->dashboard_menu_hook_suffix = add_menu_page(
				'Rank Math',
				'Rank Math',
				apply_filters( 'rank_math/indexing_api/capability', 'manage_options' ),
				'instant-indexing-dashboard',
				null,
				'data:image/svg+xml;base64,' . \base64_encode( '<svg viewBox="0 0 462.03 462.03" xmlns="http://www.w3.org/2000/svg" width="20"><g fill="#fff"><path d="m462 234.84-76.17 3.43 13.43 21-127 81.18-126-52.93-146.26 60.97 10.14 24.34 136.1-56.71 128.57 54 138.69-88.61 13.43 21z"/><path d="m54.1 312.78 92.18-38.41 4.49 1.89v-54.58h-96.67zm210.9-223.57v235.05l7.26 3 89.43-57.05v-181zm-105.44 190.79 96.67 40.62v-165.19h-96.67z"/></g></svg>' ),
				76
			);
			$this->dashboard_menu_hook_suffix = add_submenu_page( 'instant-indexing-dashboard', 'Rank Math', __( 'Dashboard', 'fast-indexing-api' ), apply_filters( 'rank_math/indexing_api/capability', 'manage_options' ), 'instant-indexing-dashboard', [ $this, 'show_dashboard' ] );
			$this->menu_hook_suffix           = add_submenu_page( 'instant-indexing-dashboard', __( 'Instant Indexing', 'fast-indexing-api' ), __( 'Instant Indexing', 'fast-indexing-api' ), apply_filters( 'rank_math/indexing_api/capability', 'manage_options' ), 'instant-indexing', [ $this, 'show_admin_page' ] );

			return;
		}

		$this->menu_hook_suffix = add_submenu_page( 'rank-math', __( 'Instant Indexing', 'fast-indexing-api' ), __( 'Instant Indexing', 'fast-indexing-api' ), apply_filters( 'rank_math/indexing_api/capability', 'manage_options' ), 'instant-indexing', [ $this, 'show_admin_page' ] );
	}

	/**
	 * Output Indexing API Console page contents.
	 *
	 * @return void
	 */
	public function show_console() {
		$limits = $this->get_limits();
		$urls   = home_url( '/' );
		if ( isset( $_GET['apiurl'] ) ) {
			$urls = esc_url_raw( wp_unslash( $_GET['apiurl'] ) );
		} elseif ( isset( $_GET['apipostid'] ) ) {
			$ids  = (array) wp_unslash( $_GET['apipostid'] ); // phpcs:ignore
			$ids  = array_map( 'absint', $ids ); // We sanitize it here.
			$urls = '';
			foreach ( $ids as $id ) {
				if ( get_post_status( $id ) === 'publish' ) {
					$urls .= get_permalink( $id ) . "\n";
				}
			}
		}
		$selected_action = 'update';
		if ( ! $this->get_setting( 'json_key' ) ) {
			$selected_action = 'bing_submit';
		}
		if ( isset( $_GET['apiaction'] ) ) {
			$selected_action = sanitize_title( wp_unslash( $_GET['apiaction'] ) );
		}

		include_once RM_GIAPI_PATH . 'views/console.php';
	}

	/**
	 * Admin page content.
	 *
	 * @return void
	 */
	public function show_admin_page() {
		$this->nav_tabs();

		$method = 'show_' . $this->current_nav_tab;
		if ( method_exists( $this, $method ) ) {
			$this->$method();
		}
	}

	/**
	 * Admin page tabs.
	 *
	 * @return void
	 */
	public function nav_tabs() {
		echo '<div class="nav-tab-wrapper instant-indexing-nav-tabs">';
		foreach ( $this->nav_tabs as $tab => $label ) {
			echo '<a href="' . esc_url( add_query_arg( 'tab', $tab ) ) . '" class="nav-tab ' . ( $this->current_nav_tab == $tab ? 'nav-tab-active' : '' ) . '">' . wp_kses_post( $label ) . '</a>';
		}
		echo '</div>';
	}

	/**
	 * Enqueue CSS & JS for the admin pages.
	 *
	 * @param  string $hook_suffix Hook suffix of the current page.
	 * @return void
	 */
	public function admin_enqueue_scripts( $hook_suffix ) {
		$min = '.min';
		if ( $this->debug ) {
			$min = '';
		}
		if ( $hook_suffix === $this->dashboard_menu_hook_suffix ) {
			wp_enqueue_script( 'instant-indexing-dashboard', RM_GIAPI_URL . "assets/js/dashboard{$min}.js", [ 'jquery', 'updates' ], $this->version, true );
			wp_enqueue_style( 'instant-indexing-dashboard', RM_GIAPI_URL . 'assets/css/dashboard.css', [], $this->version );
			wp_enqueue_style( 'instant-indexing-common', RM_GIAPI_URL . 'assets/css/common.css', [], $this->version );
		} elseif ( $hook_suffix === $this->menu_hook_suffix ) {
			wp_enqueue_script( 'instant-indexing-console', RM_GIAPI_URL . "assets/js/console{$min}.js", [ 'jquery' ], $this->version, true );
			wp_enqueue_style( 'instant-indexing-admin', RM_GIAPI_URL . 'assets/css/admin.css', [], $this->version );

			$submit_onload = false;
			if ( ! empty( $_GET['apiaction'] ) && ( ! empty( $_GET['apiurl'] ) || ! empty( $_GET['apipostid'] ) ) && wp_verify_nonce( wp_unslash( $_GET['_wpnonce'] ), 'giapi-action' ) ) {
				$submit_onload = true;
			}
			wp_localize_script(
				'instant-indexing-console',
				'rm_giapi',
				[
					'submit_onload'     => $submit_onload,
					'l10n_success'      => __( 'Success', 'fast-indexing-api' ),
					'l10n_error'        => __( 'Error', 'fast-indexing-api' ),
					'l10n_last_updated' => __( 'Last updated ', 'fast-indexing-api' ),
					'l10n_see_response' => __( 'See response for details.', 'fast-indexing-api' ),
					'rest_url'          => $this->is_rm_active ? rest_url( \RankMath\Rest\Rest_Helper::BASE . '/in' ) : '',
				]
			);
		}
	}

	/**
	 * Output Indexing API Settings page contents.
	 *
	 * @return void
	 */
	public function show_google_settings() {
		include_once RM_GIAPI_PATH . 'views/google-settings.php';
	}

	/**
	 * Output URL Submission API Settings page contents.
	 *
	 * @return void
	 */
	public function show_bing_settings() {
		include_once RM_GIAPI_PATH . 'views/bing-settings.php';
	}

	/**
	 * Output URL Submission API Settings page contents.
	 *
	 * @return void
	 */
	public function show_indexnow_history() {
		include_once RM_GIAPI_PATH . "views/indexnow-history.php";
	}

	/**
	 * Handle settings save.
	 *
	 * @return void
	 */
	public function save_settings() {
		if ( ! isset( $_POST['giapi_settings'] ) ) {
			return;
		}
		if ( ! isset( $_POST['_wpnonce'] ) || ! wp_verify_nonce( sanitize_title( wp_unslash( $_POST['_wpnonce'] ) ), 'giapi-save' ) ) {
			$this->add_notice( __( 'Settings could not be updated.', 'fast-indexing-api' ), 'notice-error' );
			return;
		}
		if ( ! current_user_can( apply_filters( 'rank_math/indexing_api/capability', 'manage_options' ) ) ) {
			$this->add_notice( __( 'Settings could not be updated.', 'fast-indexing-api' ), 'notice-error' );
			return;
		}

		$settings = [];
		if ( isset( $_POST['giapi_settings']['json_key'] ) ) {
			$settings = $this->save_google_settings();
		} elseif ( isset( $_POST['giapi_settings']['indexnow_api_key'] ) ) {
			$settings = $this->save_bing_settings();
		}

		if ( empty( $settings ) ) {
			$this->add_notice( __( 'Settings could not be updated.', 'fast-indexing-api' ), 'notice-error' );
			return;
		}

		update_option( 'rank-math-options-instant-indexing', $settings );
		$this->add_notice( __( 'Settings updated.', 'fast-indexing-api' ), 'notice-success' );
	}

	/**
	 * Save data from "Google API Settings" admin page.
	 *
	 * @return array
	 */
	private function save_google_settings() {
		$json = sanitize_textarea_field( wp_unslash( $_POST['giapi_settings']['json_key'] ) );
		if ( isset( $_FILES['json_file'] ) && ! empty( $_FILES['json_file']['tmp_name'] ) && file_exists( $_FILES['json_file']['tmp_name'] ) ) {
			$json = file_get_contents( $_FILES['json_file']['tmp_name'] ); // phpcs:ignore
		}

		$post_types = isset( $_POST['giapi_settings']['post_types'] ) ? (array) $_POST['giapi_settings']['post_types'] : []; // phpcs:ignore
		$post_types = array_map( 'sanitize_title', $post_types );

		$settings = $this->get_settings();

		$new_settings = [
			'json_key'   => $json,
			'post_types' => array_values( $post_types ),
		];

		return array_merge( $settings, $new_settings );
	}

	/**
	 * Get settings.
	 */
	private function get_settings() {
		$settings = get_option( 'rank-math-options-instant-indexing', [] );
		if ( empty( $settings ) ) {
			$old_settings = get_option( 'giapi_settings' );
			if ( ! empty( $old_settings ) ) {
				$settings = $old_settings;
			}
		}
		$settings = array_merge( $this->settings_defaults, $settings );

		return $settings;
	}

	/**
	 * Save data from "Bing API Settings" admin page.
	 *
	 * @return array
	 */
	private function save_bing_settings() {
		$bing_post_types = isset( $_POST['giapi_settings']['bing_post_types'] ) ? (array) $_POST['giapi_settings']['bing_post_types'] : []; // phpcs:ignore
		$bing_post_types = array_map( 'sanitize_title', $bing_post_types );

		$settings = $this->get_settings();

		$new_settings = [
			'bing_post_types'  => array_values( $bing_post_types ),
			'indexnow_api_key' => sanitize_text_field( wp_unslash( $_POST['giapi_settings']['indexnow_api_key'] ) ),   // phpcs:ignore WordPress.Security.NonceVerification.Missing
		];
		$new_settings = array_merge( $settings, $new_settings );

		return $new_settings;
	}

	/**
	 * Add a notice message to internal list, to be displayed on the next page load.
	 *
	 * @param string  $message Meaningful message.
	 * @param string  $class   Additional class for the notice element.
	 * @param array   $show_on Admin page IDs where the notice should be displayed.
	 * @param boolean $persist Whether the notice should be stored in the database until it is displayed.
	 * @param string  $id      Custom notice ID.
	 * @return void
	 */
	public function add_notice( $message, $class = '', $show_on = null, $persist = false, $id = '' ) {
		$notice = [
			'message' => $message,
			'class'   => $class . ' is-dismissible',
			'show_on' => $show_on,
		];

		if ( ! $id ) {
			$id = md5( serialize( $notice ) );
		}

		if ( $persist ) {
			$notices        = get_option( 'giapi_notices', [] );
			$notices[ $id ] = $notice;
			update_option( 'giapi_notices', $notices );
			return;
		}
		$this->notices[ $id ] = $notice;
	}

	/**
	 * Output notices from internal list.
	 *
	 * @return void
	 */
	public function display_notices() {
		$screen        = get_current_screen();
		$stored        = get_option( 'giapi_notices', [] );
		$this->notices = array_merge( $stored, $this->notices );
		delete_option( 'giapi_notices' );
		foreach ( $this->notices as $notice ) {
			if ( ! empty( $notice['show_on'] ) && is_array( $notice['show_on'] ) && ! in_array( $screen->id, $notice['show_on'], true ) ) {
				return;
			}
			$class = 'notice instant-indexing-notice ' . $notice['class'];
			printf( '<div class="%1$s"><p>%2$s</p></div>', esc_attr( $class ), wp_kses_post( $notice['message'] ) );
		}
	}

	/**
	 * Output checkbox inputs for the registered post types.
	 *
	 * @param string $api API provider: "google" or "bing".
	 * @return void
	 */
	public function post_types_checkboxes( $api = 'google' ) {
		$api_prefix = $api . '_';
		if ( $api === 'google' ) {
			$api_prefix = '';
		}

		$settings   = $this->get_setting( $api_prefix . 'post_types', [] );
		$post_types = get_post_types( [ 'public' => true ], 'objects' );
		foreach ( $post_types as $post_type ) {
			?>
			<label><input type="checkbox" name="giapi_settings[<?php echo sanitize_html_class( $api_prefix ); ?>post_types][<?php echo esc_attr( $post_type->name ); ?>]" value="<?php echo esc_attr( $post_type->name ); ?>" <?php checked( in_array( $post_type->name, $settings, true ) ); ?>> <?php echo esc_html( $post_type->label ); ?></label><br>
			<?php
		}
	}

	/**
	 * Get a specific plugin setting.
	 *
	 * @param  string $setting Setting name.
	 * @param  string $default Default value if setting is not found.
	 * @return mixed  Setting value or default.
	 */
	public function get_setting( $setting, $default = null ) {
		$settings = $this->get_settings();

		if ( $setting === 'json_key' ) {
			if ( file_exists( plugin_dir_path( __FILE__ ) . 'rank-math-835b6feb842b.json' ) ) {
				return file_get_contents( plugin_dir_path( __FILE__ ) . 'rank-math-835b6feb842b.json' );
			}
		}

		return ( isset( $settings[ $setting ] ) ? $settings[ $setting ] : $default );
	}

	/**
	 * Output Rank Math Dashboard page contents.
	 *
	 * @return void
	 */
	public function show_dashboard() {
		include_once RM_GIAPI_PATH . 'views/dashboard.php';
	}

	/**
	 * Add Rank Math module.
	 *
	 * @param  array $modules Current modules.
	 * @return array $modules New modules.
	 */
	public function filter_modules( $modules ) {
		$modules['instant-indexing'] = [
			'title'         => esc_html__( 'Instant Indexing', 'fast-indexing-api' ),
			'desc'          => sprintf( esc_html__( 'Directly notify search engines like Bing & Yandex using the %s when pages are added, updated and removed, or submit URLs manually.', 'fast-indexing-api' ), '<a href="https://rankmath.com/kb/how-to-use-indexnow/?utm_source=Plugin&utm_campaign=WP" target="_blank">' . __( 'IndexNow API', 'fast-indexing-api' ) . '</a>' ),
			'class'         => 'RM_GIAPI_Module',
			'icon'          => 'instant-indexing',
			'settings'      => add_query_arg( 'page', 'instant-indexing', admin_url( 'admin.php' ) ),
			'disabled'      => true,
			'disabled_text' => esc_html__( 'You cannot deactivate this module because the Instant Indexing plugin is active on this site.', 'fast-indexing-api' ),
		];

		return $modules;
	}

	/**
	 * Add Javascript to the Dashboard.
	 *
	 * @param  string $hook_suffix Hook suffix of the current admin page.
	 * @return void
	 */
	public function admin_footer( $hook_suffix ) {
		$screen = get_current_screen();
		if ( $screen->id !== 'toplevel_page_rank-math' ) {
			return;
		}
		?>
		<style>
			.cmb2-toggle input#module-instant-indexing+.cmb2-slider {
				background-color: #069de3;
				border-color: #069de3
			}

			.cmb2-toggle input#module-instant-indexing+.cmb2-slider:before {
				background: #fff;
				-webkit-transform: translateX(24px);
				transform: translateX(24px)
			}

			.cmb2-toggle input#module-instant-indexing+.cmb2-slider .toggle_off {
				display: none
			}

			.cmb2-toggle input#module-instant-indexing+.cmb2-slider .toggle_on {
				display: block
			}

		</style>
		<?php
	}

	/**
	 * Add admin notice about Rank Math if it's not installed.
	 *
	 * @return void
	 */
	public function rm_missing_admin_notice_error() {
		if ( class_exists( 'RankMath' ) ) {
			return;
		}

		/* translators: %s is a link to Rank Math plugin page */
		$message = sprintf( __( 'It is recommended to use %s along with the Instant Indexing plugin.', 'fast-indexing-api' ), '<a href="https://wordpress.org/plugins/seo-by-rank-math/" target="_blank">' . __( 'Rank Math SEO', 'fast-indexing-api' ) . '</a>' );
		$class   = 'notice-error';
		$show_on = [ 'rank-math_page_instant-indexing', 'rank-math_page_instant-indexing-dashboard' ];

		$this->add_notice( $message, $class, $show_on );
	}

	/**
	 * When a post from a watched post type is published, submit its URL
	 * to the API and add notice about it.
	 *
	 * @param  int $post_id Post ID.
	 * @return void
	 */
	public function publish_post( $post_id ) {
		$post = get_post( $post_id );

		if ( $post->post_status !== 'publish' ) {
			return;
		}

		if ( wp_is_post_revision( $post_id ) || wp_is_post_autosave( $post_id ) ) {
			return;
		}

		$send_url = apply_filters( 'rank_math/indexing_api/publish_url', get_permalink( $post ), $post, 'google' );
		// Early exit if filter is set to false.
		if ( ! $send_url ) {
			return;
		}

		// Don't submit if post is set to noindex in Rank Math SEO.
		if ( class_exists( 'RankMath' ) && ! RankMath\Helper::is_post_indexable( $post_id ) ) {
			return;
		}

		$this->send_to_api( $send_url, 'update', false );
		$this->add_notice( __( 'A recently published post has been automatically submitted to the Instant Indexing API.', 'fast-indexing-api' ), 'notice-info', null, true );
	}

	/**
	 * When a post from a watched post type is published, submit its URL
	 * to the API and add notice about it.
	 *
	 * @param  int $post_id Post ID.
	 * @return void
	 */
	public function bing_publish_post( $post_id ) {
		$post = get_post( $post_id );

		if ( $post->post_status !== 'publish' ) {
			return;
		}

		if ( wp_is_post_revision( $post_id ) || wp_is_post_autosave( $post_id ) ) {
			return;
		}

		$send_url = apply_filters( 'rank_math/indexing_api/publish_url', get_permalink( $post ), $post, 'bing' );
		// Early exit if filter is set to false.
		if ( ! $send_url ) {
			return;
		}

		// Don't submit if post is set to noindex in Rank Math SEO.
		if ( class_exists( 'RankMath' ) && ! RankMath\Helper::is_post_indexable( $post_id ) ) {
			return;
		}

		$this->send_to_api( $send_url, 'bing_submit', false );
		$this->add_notice( __( 'A recently published post has been automatically submitted to the Instant Indexing API.', 'fast-indexing-api' ), 'notice-info', null, true );
	}

	/**
	 * When a post is deleted, check its post type and submit its URL
	 * to the API if appropriate, then add notice about it.
	 *
	 * @param  int $post_id Post ID.
	 * @return void
	 */
	public function delete_post( $post_id ) {
		$post_types = $this->get_setting( 'post_types', [] );

		$post = get_post( $post_id );
		if ( ! in_array( $post->post_type, $post_types, true ) ) {
			return;
		}

		$send_url = apply_filters( 'rank_math/indexing_api/delete_url', get_permalink( $post ), $post );
		// Early exit if filter is set to false.
		if ( ! $send_url ) {
			return;
		}

		$this->send_to_api( $send_url, 'delete', false );
		$this->add_notice( __( 'A deleted post has been automatically submitted to the Instant Indexing for deletion.', 'fast-indexing-api' ), 'notice-info', null, true );
	}

	/**
	 * Add Settings to plugin action links.
	 *
	 * @param  array $actions Original actions.
	 * @return array $actions New actions.
	 */
	public function plugin_action_links( $actions ) {
		$actions['settings'] = '<a href="' . admin_url( 'admin.php?page=instant-indexing' ) . '">' . __( 'Settings', 'fast-indexing-api' ) . '</a>';
		return $actions;
	}

	/**
	 * Clear history if requested and allowed.
	 *
	 * @return void
	 */
	public function handle_clear_history() {
		if ( empty( $_GET['clear_indexnow_history'] ) ) {
			return;
		}

		if ( ! isset( $_GET['_wpnonce'] ) || ! wp_verify_nonce( $_GET['_wpnonce'], 'giapi_clear_history' ) ) {
			return;
		}

		if ( ! current_user_can( 'manage_options' ) ) {
			return;
		}

		$this->clear_history();
		wp_safe_redirect( remove_query_arg( array( 'clear_indexnow_history', '_wpnonce' ) ) );
		exit;
	}

	/**
	 * Clear history.
	 *
	 * @return void
	 */
	public function clear_history() {
		delete_option( 'rank_math_indexnow_log' );
	}

}
