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
    // windows
    'views/login',
//    'views/register',
//    'views/upload',
//    'views/webcam',
//    'views/remind',
//    'views/rules',
//    'views/thanks',
//    'views/feedback'
],
function( registry, router, Login ) {

    Backbone.log( 'App@', arguments );

    var App,
        app,

        // views of application stages
        defaultView = 'login',
        views = {
            // todo: make some views invisible for unauthorized visitors
            login: Login,
//            register: Register,
//            upload: Upload,
//            webcam: Webcam,
//            remind: Remind,
//            rules: Rules,
//            thanks: Thanks,
//            feedback: Feedback
        };


    /**
     * Initialize Application
     */
    function init() {
        // Startup

        // Application
        app = new App({ model: registry });
        app.$el.appendTo( 'body' );


        // debug
        var view;
        registry.on( 'change:state', function() {
            view = views[ registry.get( 'state' ) || defaultView ];
        });
        setInterval( function() {
            if ( view ) view.render();
        }, 1000 );


        // initial state
        registry.trigger( 'change:state' );
    }


    /**
     * Application
     */
    App = Backbone.Layout.extend(
    {
        template: 'layout',

        initialize: function() {
            // listen app-state changes
            this.model.on( 'change:state',
                this.render, this );
            // todo: optimize renders
        },

        serialize: function() {
            return {
                result: Math.random().toString( 16 ).substr( 2 )
            }
        },

        beforeRender: function() {
            this.log( 'render..', this.model.get( 'state' ));
            var view = views[ this.model.get( 'state' ) || defaultView ];
            if ( !view )
                throw new Error( 'Unknown state!' );
            this.insertView( /*'#contents',*/ view );
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
        addAppView: function( name, view ) {
            if (!( view instanceof Function ))
                return Backbone.log( 'Bad view constructor!', name );
            if ( views[ name ])
                return Backbone.log( 'View name already used!', name );
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
        }
    }
});
