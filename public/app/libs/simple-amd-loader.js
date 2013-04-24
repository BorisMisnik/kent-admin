/*!
 * Simple AMD loader
 * ( not finished )
 *
 * @author Andjey Guzhovskiy, <me.the.ascii@gmail.com>
 * @copyright (c) 2013 Andjey Guzhovskiy
 * @licence CLOSED
 * @version 0.0.1
 */

function init() {
    define( 'test1',
        [
            '/js/app',
            '/js/app2'
        ],
        function() {
            //console.log( 'define() loaded:', arguments );
        });
}
setTimeout( init, 0 );

///// ///// ///// ///// ///// ///// ///// ///// ///// ///// config

var extension = '.html',
    templates = {},
    defined = {};

///// ///// ///// ///// ///// ///// ///// ///// ///// ///// amd

/**
 * Basic AMD implementation
 * @param {String} name
 * @param {Array} deps
 * @param {Function} complete
 */
function define( name, deps, complete ) {
    var loads = [],
        loading,
        path,
        timeout = 10000;

    // args
    if ( $.isFunction( deps ))
        var complete = deps,
            deps = name,
            name = undefined;
    deps = [].concat( deps );

    // params
    if ( !$.isFunction( complete ))
        return;
    if ( defined[ name ])
        complete( new Error( 'Duplicate application name' ));
    if ( !name )
        name = Math.random().toString( 16 ).substr( 2 );

    // loading
    for ( var id in deps ) {
        if ( deps.hasOwnProperty( id )) {
            path = deps[ id ];
            // cache
            if ( defined[ path ]) {
                //console.log( 'exists', path );
            } else {
                // loading
                loading = load( path );
                loading &&
                loads.push( loading );
            }
        }
    }
    if ( loads.length ) {
        // loading
        loading = $.when
            .apply( this, loads )
            .always( function(){
                // stop timer
                timeout = clearTimeout( timeout );
            })
            .done( function() {
                var res = [],
                    args = [].slice.call( arguments );
                // args
                if ( !$.isArray( args[ 0 ]))
                    res = [].concat( args );
                else
                    res = args;
                // callback( null, app());
                //console.log( 'load.done:', res );
                defined[ name ] = complete.apply( this, res );
            })
            .fail( function( err ) {
                //console.log( 'Error raised in loaded script' );
                throw err;
            });

        // timeout error
        timeout = setTimeout(
            function() {
                loading &&
                loading.reject( new Error( 'Loading timeout' ));
            }, timeout );
    }
}

define.require = function( name ) {
    return defined[ name ];
};
define.amd = true;

function load( path ) {
    var defer = $.Deferred(),
        type = 'script';

    // determinate type
    if ( 'text!' == path.substr( 0, 5 )) {
        type = 'text';
        path = path.substr( 5 );
    }
    if ( 'css!' == path.substr( 0, 4 )) {
        type = 'css';
        path = path.substr( 4 );
    }
    if ( 'script!' == path.substr( 0, 7 )) {
        type = 'script';
        path = path.substr( 7 );
    }

    // loading
    switch( type ) {

        case 'text':
            return $.get( path );

        case 'css':
            if ( document.createStyleSheet ) // ie
                document.createStyleSheet( path );
            else
            // all other browsers
                $( 'head' ).append(
                    $( '<link rel="stylesheet" href="'+ path +'" type="text/css" media="screen" />' ));
            return defer.promise();

        case 'script':
        default:
            $.ajax({
                url: path + '.js',
                mimeType: 'text/plain'
            })
                .done( function( script ) {
                    //console.log( 'ajax loaded:', arguments );
                    var res = eval( script );
                    defer.resolve( res );
                })
                .fail( function() {
                    defer.reject( new Error( arguments[ 2 ]));
                });
            return defer.promise();
    }
}

