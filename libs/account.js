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
    auth = server.libs.auth,
    check = server.utils.check,
    filter = server.utils.filter,
    ObjectID = server.utils.ObjectID,
    fs = require('fs');


exports.login =
    function( req, res ) {
        console.log( 'login' );
        res.send({ success: true });
    };

exports.logout =
    function( req, res ) {
        console.log( 'logout' );
        req.logout();
        res.send({ success: 'Logged out' });
        console.log( '<logout' );
    };

exports.remind =
    function( req, res ) {
        console.log( 'remind' );
        // todo: (!)
    };

exports.signup =
    function( req, res ) {

        console.log( 'signup:', req.body );

        normalizeSignup( req.body, function( err, profile ) {

            // errors
            if ( err ) {
                console.log( 'fatal error', err );
                err.error = true;
                return res.json( err );
            }

            // check user already exists
            auth.byLogin(
                profile.email,
                function( err, user ) {
                    if ( err )
                        return res.json({ error: err });
                    if ( user ) {
                        console.log( 'error' );
                        res.json({
                            error: 'Already used email address',
                            already_used_email: true
                        });
                    }
                    else {

                        // register user
                        auth.create(
                            {
                                login: profile.email,
                                password: profile.password // todo md5
                            },
                            function( err, stored ) {

                                if ( err || !stored || !stored.length )
                                    return res.send({ error: err || true, database: true });

                                // create profile card
                                var stored = stored[ 0 ],
                                    data = server.utils.object.merge(
                                    profile,
                                    {
                                        account_id: stored._id,
                                        type: 'profile'
                                    });
                                cards.create( data,
                                    function( err, doc ) {
                                        console.log( 'created & registered', err, doc );
                                        if ( err )
                                            return res.send({ error: err || true });
                                        // success
                                        doc.success = true;
                                        delete doc.photo;   // remove image from response
                                        res.send( doc );
                                    });
                            });

                    }
                });
        });
    };

exports.user =
    function( req, res ) {
        console.log( 'get user' );
        if ( req.user && req.user._id )
            res.send({ success: true });
        else
            res.send({ error: true });
    };

exports.account =
    function( req, res ) {
        debugger;
        console.log( 'account' );
        console.log( 'account user:', req.user );
        cards.get(
            { account_id: ObjectID( req.user._id ) },
            function( err, doc ) {
                if ( err )
                    return res.send({ error: true, database: true });
                // response
                res.send({
                    user: req.user,
                    profile: doc,
                    success: true
                });
            });
    };

exports.updateProfile = function( req, res ) {
    var values = req.body;

    // normalize
    normalizeProfile( values,
        function( err, profile ) {

            debugger;

            // database error
            if ( err ) {
                console.log( 'Database error'.red.bold, err );
                res.send({
                    error: true,
                    database: true
                });
                return;
            }

            // modifiers:
            // could not edit email! because email it's login
            //delete profile.email;
            // uneditable
            //delete profile.photo;

            console.log( 'values:', values, req.body );
            console.log( 'updateProfile normalized:', err, profile );

            // update card
            cards.update(
                {
                    account_id: ObjectID( req.user._id ),
                    type: 'profile'
                },
                profile,
                { safe: true },
                function( err, doc ) {

                    // update user
                    auth.update(
                        req.user._id,
                        // todo: change email/login
                        { password: profile.password },
                        function( err, usr ) {

                            // database error
                            if ( err ) {
                                console.log( 'Database error'.red.bold, err );
                                res.send({
                                    error: true,
                                    database: true
                                });
                                return;
                            }

                            // results
                            res.send({
                                success: true,
                                profile: profile,
                                user: req.user
                            });
                    });
                });
        });
};


// Validators

/**
 * Errors:
 *
 *  * {Boolean} name
 *  * {Boolean} age
 *  * {Boolean} phone
 *  * {Boolean} email
 *  * {Boolean} password
 *  * {Boolean} not_same_passwords
 *  * {Boolean} photo
 *  * {Boolean} not_agree
 *
 *  Success:
 *
 *  * {Object} form
 *
 * @param fields
 * @param callback
 */
function normalizeSignup( fields, callback )
{
    if ( !callback ) return;

    var form = {
            name: String( fields.name || '' ),
            day: parseInt( fields.day ) || 1,
            month: parseInt( fields.month ) || 11,
            year: parseInt( fields.year ) || 2013,
            phone: String( fields.phone || '' ),
            email: String( fields.email || '' ),
            password: String( fields.password || '' ),
            password2: String( fields.password2 || '' ),
            agree_age: fields.agree_age == 'true',
            agree_rules: fields.agree_rules == 'true',
            agree_info: fields.agree_info == 'true',
            photo: String( fields.photo || '' )
        },
        errors = {};

    //console.log( 'parsed:', form );

    // name
    if ( !form.name
        || form.name.length >254 )
        errors.name = true;

    // age
    var age = new Date( form.year, form.month-1, form.day ),
        date = new Date();
    date.setMonth( date.getMonth() - 12 * 18 );
    if ( age.getTime() > date.getTime() )
        errors.age = true;

    // phone
    if ( !form.phone
        || !form.phone.match( /\d{1}\s{1}\(\d{2}\)\s{1}\d{3}\-\d{2}\-\d{2}/ ))  // d (dd) ddd-dd-dd
        errors.phone = true;

    // email
    if ( !form.email
        || form.email.length > 254
        || !check.notEmpty( form.email )
        || !check.isEmail( form.email ))
        errors.email = true;

    // password
    if ( !form.password
        || form.password.length > 50 )
        errors.password = true;

    // not_same_passwords
    if ( form.password !== form.password2 )
        errors.not_same_passwords = true;

    // agree
    if ( !form.agree_age
        || !form.agree_rules
        || !form.agree_info )
        errors.not_agree = true;

    // photo
    // todo: photo upload check ( fs )
    if ( !form.photo )
        errors.photo = true;

    // todo: xss filters and other

    // results
    if ( Object.keys( errors ).length )
        callback( errors );
    else
        callback( null, form )
}


/**
 * Errors:
 *
 *  * {Boolean} name
 *  * {Boolean} day
 *  * {Boolean} age
 *  * {Boolean} phone
 *  * {Boolean} email
 *  * {Boolean} password
 *  * {Boolean} cigarettes1
 *  * {Boolean} cigarettes2
 *  * {Boolean} same_cigarettes
 *
 *  Success:
 *
 *  * {Object} form
 *
 * @param fields
 * @param callback
 */
function normalizeProfile( fields, callback )
{
    if ( !callback ) return;

    var form = {
            name: String( fields.name || '' ),
            day: parseInt( fields.day ) || 1,
            month: parseInt( fields.month ) || 11,
            year: parseInt( fields.year ) || 2013,
            phone: String( fields.phone || '' ),
            email: String( fields.email || '' ),
            password: String( fields.password || '' ),
            brand1: String( fields.brand1 || '' ),
            sku1: String( fields.sku1 || '' ),
            brand2: String( fields.brand2 || '' ),
            sku2: String( fields.sku2 || '' )
        },
        errors = {};

    //console.log( 'parsed:', form );

    // name
    if ( !form.name
        || form.name.length >254 )
        errors.name = true;

    // age
    var age = new Date( form.year, form.month, form.day ),
        date = new Date();
    date.setMonth( date.getMonth() - 12 * 18 );
    if ( age.getDate() != form.day )
        errors.day = true;
    if ( age.getTime() > date.getTime() )
        errors.age = true;

    // phone
    if ( !form.phone
        || !form.phone.match( /\d{1}\s{1}\(\d{2}\)\s{1}\d{3}\-\d{2}\-\d{2}/ ))  // d (dd) ddd-dd-dd
        errors.phone = true;

    // email
    if ( !form.email
        || form.email.length > 254
        || !check.notEmpty( form.email )
        || !check.isEmail( form.email ))
        errors.email = true;

    // password
    if ( !form.password
        || form.password.length > 50 )
        errors.password = true;

//    // brand, sku 1
//    if ( !form.brand1 || !form.sku1 )
//        errors.cigarettes1 = true;
//    // brand, sku 2
//    if ( !form.brand2 || !form.sku2 )
//        errors.cigarettes2 = true;
//    // same cigarettes
//    if ( !errors.cigarettes1
//        && !errors.cigarettes2
//        && form.sku1 == form.sku2 )
//        errors.same_cigarettes = true;

    // todo: check is sku apply to brand?

    // todo: xss filters and other stuff

    // results
    if ( Object.keys( errors ).length )
        callback( errors );
    else
        callback( null, form );
}