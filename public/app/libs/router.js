/*!
 * Module: Module
 *
 * @author Andjey Guzhovskiy, <me.the.ascii@gmail.com>
 * @copyright (c) 2013 Andjey Guzhovskiy
 * @licence CLOSED
 * @version 0.0.1
 */

define(
    [ '../models/registry' ],
    function( registry ) {

        /**
         * Router
         */

        // state routes
        var router = new Backbone.Router(),
            urls = { /* route: url */};

        // add route
        function addStateRoute ( route, state, url ) {
            console.log( route );
            // urls
            if ( route && urls[ state ])
                Backbone.log( 'Url of given State already exists!' );
            else
                urls[ state ] = url || 'views/' + state;
            // assign route
            //console.log( 'route url:', route );
            router.route( route, function() {
                //console.log( 'route change state from:', registry.get( 'state' ), 'to:', state );
                registry.set( 'state', state );
                // app: state changes handled in `app.js` `initialize()`
                // see: libs/app.js
            });
        }


        // Init

//        // add routes
//        Object.keys( routes || {})
//            .forEach( function( url ) {
//                addStateRoute( url, routes[ url ]);
//            });

        // init router
        Backbone.history.fragment = null;
        Backbone.history.start(); // { pushState: true });


        // API

//        router.startup = function() {
//            // init router
//            Backbone.history.fragment = null;
//            Backbone.history.start(); // { pushState: true });
//        };
        router.currentUrl = function() {
            var current = Backbone.history.fragment;
            Backbone.history.fragment = null;
            router.navigate( current, { trigger: true });
        };
        router.addStateRoute = addStateRoute;
        router.getUrl = function( route ) {
            return urls[ route ];
        };
        return router;

    });

