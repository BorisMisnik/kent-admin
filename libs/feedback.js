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
    mail = server.libs.mail,
    check = server.utils.check,
    filter = server.utils.filter,
    ObjectID = server.utils.ObjectID,
    // locals
    fromEmail = 'Kent <postmaster@kent.com.ua>';

exports.feedback = function( req, res ) {

    var email,
        name,
        message = String( req.body.message || '' ),
        user_id = ObjectID( req.user && req.user._id );

    console.log( 'Feedback:', req.user, message );
    if ( !user_id ) return res.send({ error: { user: true }});

    debugger;

    // get user profile
    cards.get(
        { type: 'profile', account_id: user_id },
        function( err, profile ) {
            // errors
            if ( err || !profile || !profile.email )
                return res.send({ error: { profile: true }});
            // checkings
            if ( !message
                || message.length > 4069 )
                return res.send({ error: { message: true }});
            // log
            console.log( 'Feedback form:', profile.email, profile.name, message );
            // store
            cards.create(
                {
                    account_id: ObjectID( req.user && req.user._id ),
                    type: 'feedback',
                    email: profile.email,
                    name: profile.name,
                    message: message
                },
                {
                    exists: false
                },
                function( err, doc ) {
                    // errors
                    if ( err || !doc )
                        return res.send({ error: { create: true }});
                    // success
                    res.json({ success: doc });
                });
        });
};

exports.answer = function( req, res ) {
    var id = ObjectID( req.params.id ),
        opts = req.body || {};
    if ( !id ) return res.send({ error: { id: true }});

    // get feedback
    cards.get(
        { type: 'feedback', _id: id },
        function( err, feedback ) {
            if ( err ) return res.send({ error: { database: true }});
            if ( !feedback ) return res.send({ error: { not_found: true }});

            // get user profile
            cards.get(
                { type: 'profile', account_id: feedback.account_id },
                function( err, profile ) {
                    // errors
                    if ( err || !profile ) return res.send({ error: { profile: true }});
                    if ( !profile.email ) return res.send({ error: { no_email: true }});
                    // values
                    var subject = req.body.subject,
                        answer = req.body.answer;
                    if ( !subject || !subject.length || subject.length > 250 )
                        return res.send({ error: { subject: true }});
                    if ( !answer || !answer.length || answer.length > 4000 )
                        return res.send({ error: { answer: true }});

                    // send mail
                    mail.send(
                        {
                            from: fromEmail,
                            to: profile.name +' <'+ profile.email +'>',
                            subject: subject,
                            body: answer
                        },
                        function( err, sent ) {
                            if ( err ) console.log( 'Mail error'.red.bold, err );
                        });

                    // update
                    feedback.subject = subject;
                    feedback.answer = answer;
                    feedback.answered = new Date();
                    cards.update(
                        { type: 'feedback', _id: id },
                        feedback,
                        function( err ) {
                            if ( err ) return res.send({ error: { update: true }});
                            res.send({ success: feedback });
                        });

                });
        });
};

exports.list = function( req, res ) {
    debugger;
    cards.list(
        { type: 'feedback' },
        { limit: 10000 },      // todo: paginator
        function( err, list ) {
            if ( err || !list ) return res.send({ error: { database: true }});
            res.send({ success: list });
        });
};

exports.get = function( req, res ) {
    var id = ObjectID( req.params.id );
    if ( !id ) return res.send({ error: { id: true }});
    cards.get(
        { type: 'feedback', _id: id },
        function( err, feedback ) {
            if ( err ) return res.send({ error: { database: true }});
            if ( !feedback ) return res.send({ error: { not_found: true }});
            res.send({ success: feedback });
        });
};

exports.remove = function( req, res ) {
    var id = ObjectID( req.params.id );
    cards.remove(
        { type: 'feedback', _id: id },
        function( err, removed ) {
            if ( err ) return res.send({ error: { database: true }});
            res.send({ success: removed });
        });
};

exports.update = function( req, res ) {
    res.send({ error: { not_implement: true }});
};