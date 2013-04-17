/*!
 * Module: Module
 *
 * @author Andjey Guzhovskiy, <me.the.ascii@gmail.com>
 * @copyright (c) 2013 Andjey Guzhovskiy
 * @licence CLOSED
 * @version 0.0.1
 */

var server = require( 'piezo-server' ),
    cards = server.libs.cards,
    check = server.utils.check,
    filter = server.utils.filter,
    ObjectID = server.utils.ObjectID;

exports.feedback = function( req, res ) {

    var errors = {},
        email = String( req.body.email || '' ),
        name = String( req.body.name || '' ),
        message = String( req.body.message || '' ),
        record;

    // checks
    // name
    if ( !name
        || name.length > 254 )
        errors.name = true;

    // email
    if ( !email
        || email.length > 254
        || !check.notEmpty( email )
        || !check.isEmail( email ))
        errors.email = true;

    // message
    if ( !message
        || message.length > 4069 )
        errors.message = true;

    // catch errors
    if ( Object.keys( errors ).length ) {
        console.log( 'Feedback form errors:', errors );
        errors.error = true;
        return res.send( errors );
    }

    // values data
    record = {
        email: email,
        name: name,
        message: message
    };
    console.log( 'Feedback form:', record );
    debugger;

    // store
    cards.create(
        {
            account_id: ObjectID( req.user && req.user._id ),
            type: 'feedback',
            email: email,
            name: name,
            message: message
        },
        function( err, doc ) {

            if ( err || !doc )
                return res.send({ error: err || true, database: true });
            // success
            res.json({ success: true });
        });

};