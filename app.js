/*!
 * Piezo Service
 * =============
 *
 * @author Andjey Guzhovskiy, <me.the.ascii@gmail.com>
 * @copyright (c) 2013 Andjey Guzhovskiy
 * @licence CLOSED
 * @version 0.0.1
 */

var server = require( 'piezo-server' ),
    colors = require( 'colors' ),
    // settings
    config = require( './config.json' ),
    routes = require( './routes.json' );

// todo: simplify
if ( config.http )
    config.http.routes = routes;

server
    .configure( config )
    .init( function() {
        console.log(( '=== Started ' + new Array( 50 ).join( '=' )).bold.magenta );
    });

