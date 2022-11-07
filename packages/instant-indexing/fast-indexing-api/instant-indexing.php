<?php
/**
 * Plugin Name: Instant Indexing
 * Plugin URI: https://rankmath.com/wordpress/plugin/instant-indexing/
 * Description: Get your website crawled immediately by Google using their NEW Indexing APIs.
 * Version: 1.1.16
 * Author: Rank Math
 * Author URI: https://s.rankmath.com/home
 * License: GPL v3
 * Text Domain: fast-indexing-api
 * Domain Path: /languages
 *
 * @package Instant Indexing
 */

defined( 'ABSPATH' ) || die;

define( 'RM_GIAPI_PATH', plugin_dir_path( __FILE__ ) );
define( 'RM_GIAPI_FILE', plugin_basename( __FILE__ ) );
define( 'RM_GIAPI_URL', plugin_dir_url( __FILE__ ) );

/**
 * Require Rank Math module class.
 */
require_once 'includes/class-instant-indexing-module.php';

/**
 * Require plugin class.
 */
require_once 'includes/class-instant-indexing.php';

/**
 * Instantiate plugin.
 */
add_action( 'plugins_loaded', 'rm_giapi_init', 9 );

/**
 * Init plugin.
 *
 * @return void
 */
function rm_giapi_init() {
	$rm_giapi = new RM_GIAPI();
}
