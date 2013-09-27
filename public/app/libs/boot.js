/*!
 * Application Bootstrap and Configurator
 *
 * @author Andjey Guzhovskiy, <me.the.ascii@gmail.com>
 * @copyright (c) 2013 Andjey Guzhovskiy
 * @licence CLOSED
 * @version 0.0.1
 */

define(
    'libs/boot',
    [ 'js!hogan' ],
    function() {

        //console.log( 'Boot!' );

        /**
         * Configuration
         */
        // todo: move to config.json and make curl.js json loader (!)
        var config = {
            log: {
                types: {
                    log: true,
                    info: true,
                    error: true,
                    warn: true
                },
                local: true,
                remote: {
                    // todo: debug-server
                    url: 'http://localhost:8080/logs/message'
                }
            }
        };

        /**
         * Intialize & Configure
         */

        // Backbone

        // Templating

        var extension = '.html',
            templates = {};

        /**
         * Preload and compile template
         */
        Backbone.Layout.configure({
            prefix: 'templates/',
            fetch: function( path ) {
                // cache
                if ( templates[ path ])
                    return templates[ path ];
                // load
                var done = this.async();
                $.get( 'app/' + path + extension )
                    .done( function( contents ) {
                        // hogan.js compiler
                        templates[ path ] = Hogan.compile( contents );
                        done( templates[ path ]);
                    })
                    .fail( function() {
                        done();
                    });
            },
            render: function( template, values ) {
                return template.render( values );
            }
        });

        /**
         * Extend
         */

        // Logging

        Backbone.log = log;
        Backbone.Model.prototype.log = log;
        Backbone.Collection.prototype.log = log;
        Backbone.View.prototype.log = log;
        Backbone.Router.prototype.log = log;

        function log( type ) {
            var args = [].slice.call( arguments ),
                message;

            // type of message
            if ( type in [ 'error', 'warn', 'info', 'log' ])
                args.shift();
            else var type = 'log';
            // exclude some logs
            if ( type && !config.log.types[ type ])
                return;

            // serialize objects
            if ( JSON )
                for ( var id in args )
                    if ( args.hasOwnProperty( id ))
                        try {
                            args[ id ] = JSON.stringify( args[ id ]);
                        } catch( err ) {}

            message = args.join( ' ' );

            // show in console
            if ( config.log.local )
                if ( window.console
                    && window.console.log )
                    window.console.log( message );

            // todo: debug-server usage
            // todo: aggregate messages

//                // debug-server
//                if ( config.log.remote ) {
//                    // post client log message to the debug-server
//                    $.post(
//                        config.log.remote.url,
//                        { message: message },
//                        'json'
//                    );
//                }
        }
    });
