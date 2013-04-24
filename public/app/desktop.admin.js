/*!
 * Module: Module
 *
 * @author Andjey Guzhovskiy, <me.the.ascii@gmail.com>
 * @copyright (c) 2013 Andjey Guzhovskiy
 * @licence CLOSED
 * @version 0.0.1
 */

// Admin Desktop

define(
    [ 'libs/app' ],
    function( app ) {

        //console.log( 'desktop.admin' );
        return Backbone.Layout.extend({
            template: 'test',
            initialize: function() {
                //console.log( 'desktop.admin : init' );
            }
        });
    });

//console.log( '- desktop admin' );