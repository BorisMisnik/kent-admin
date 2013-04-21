/*!
 * Application Core
 *
 * @author Andjey Guzhovskiy, <me.the.ascii@gmail.com>
 * @copyright (c) 2013 Andjey Guzhovskiy
 * @licence CLOSED
 * @version 0.0.1
 */

define(
[
    // core
    'models/registry',
    'libs/router',
    // locals
    'views/com/menu'
],
function( registry, router, menu ) {

    Backbone.log( 'App@', arguments );

    var App,
        app,

        // views of application stages
        //defaultView = 'login',
        // each view will be loaded on firt call
        views = {};

    /**
     * Initialize Application
     */
    function init() {
        // Startup

        // Application
        app = new App();
        app.$el.appendTo( 'body' );

        // initial state
        //registry.set( 'state', defaultView );
        app.render();
    }


    /**
     * Application
     */
    App = Backbone.Layout.extend(
    {
        template: 'layout',
        // Global registry
        model: registry,

        initialize: function() {

            var self = this;
            // listen app-state changes
            self.model.on( 'change:state',
                function( model, state, url ) {

                    // switch to exists view
                    if ( views[ state ]) {
                        self.render();
                        return;
                    }
                    // LOAD VIEW (!)
                    require(
                        router.getUrl( state ),
                        function( mod ) {
                            // register view
                            if ( 'function' == typeof mod ) {
                                views[ state ] = new mod();
                                // render application
                                if ( state == self.model.get( 'state' ))
                                    self.render();
                            }
                        });

                }, this );
        },

        serialize: function() {
            return {
                result: Math.random().toString( 16 ).substr( 2 )
            }
        },

        beforeRender: function() {
            var state, view;

            // main page layout

            // menu
            this.insertView( '#menu', menu );

            // page
            state = this.model.get( 'state' );
            this.log( 'render..', state );
            if ( !state ) return;
            view = views[ state /*|| defaultView*/ ];

            if ( !view )
                throw new Error( 'Unknown state!' );
            else
                this.insertView( '#box', view );
            // todo: fade elder
        },
        afterRender: function() {
            // todo: fade in
        }
    });


    // init on ready
    $( document )
        .ready( init );


    // API
    return {
        router: router,
        addAppView: function( name, view ) {
            if ( views[ name ])
                return Backbone.log( 'View name already used!', name );
            if ( view
                && !( view instanceof Function ))
                return Backbone.log( 'Bad view constructor!', name );
            // add view
            views[ name ] = view;

            // todo: Add route (!)
        },
        removeAppView: function( name ) {
            var store = views[ name ];
            if ( !store )
                return Backbone.log( 'Application view not found!', name );
            // remove view
            delete views[ name ];
            return store;

            // todo: Remove route (!)
        },
        state: function( name ) {
            registry.set( 'state', name );
        }
    }
});
