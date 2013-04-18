/*!
 * Module: Module
 *
 * @author Andjey Guzhovskiy, <me.the.ascii@gmail.com>
 * @copyright (c) 2013 Andjey Guzhovskiy
 * @licence CLOSED
 * @version 0.0.1
 */

exports.desktop =
    function( req, res ) {
        console.log( '\n\ndesktop:', req.user );
        if ( !req.user || !req.user.role )
            return res.send( 403 );
        // switch to desktop
        // console.log( '\n\ndesktop:', req.user.role );
        res.redirect( '/app/desktop.' + req.user.role + '.js' );
    };