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
        //app.router.addStateRoute( '!/desktop', 'desktop', '/desktop.js' );
        //app.router.addStateRoute( '!/accounts', 'accounts', '/accounts.js' );

        // call router of current page
        app.router.currentUrl();

        // app: After user logged in the menu refresh self items and add new routes
        // see: views/menu.js

        // debug
        // todo: remove
        window.app = app;
    });

console.log( '- main' );