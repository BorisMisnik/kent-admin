/*!
 * Module: Module
 *
 * @author Andjey Guzhovskiy, <me.the.ascii@gmail.com>
 * @copyright (c) 2013 Andjey Guzhovskiy
 * @licence CLOSED
 * @version 0.0.1
 */

exports.test =
    function( req, res ) {
        console.log( 'TEST' );
        //res.set( 'Content-Type', 'application/json; charset=utf-8' );
        res.send({ ok: true });
    };