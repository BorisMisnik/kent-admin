/*!
 * Module: Module
 *
 * @author Andjey Guzhovskiy, <me.the.ascii@gmail.com>
 * @copyright (c) 2013 Andjey Guzhovskiy
 * @licence CLOSED
 * @version 0.0.1
 */

// Main Application
// ( layout + login screen )

define(
    [ 'libs/app' ],
    function( app ) {

        // module 'login' will be autoload on first usage
        app.router.addStateRoute( '', 'login' );
        app.router.addStateRoute( '!/login', 'login' );
        // desktop ( by user role, on server )
        app.router.addStateRoute( '!/desktop', 'desktop', '/desktop.js' );

        // login
        //app.state( 'login' );
        app.router.initUrl();

    });

console.log( '- main' );