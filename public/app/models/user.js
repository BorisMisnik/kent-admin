/*!
 * Module: Module
 *
 * @author Andjey Guzhovskiy, <me.the.ascii@gmail.com>
 * @copyright (c) 2013 Andjey Guzhovskiy
 * @licence CLOSED
 * @version 0.0.1
 */

// singleton

define(
    [],
    function() {

        var User = Backbone.Model.extend({
                defaults: {
                    authorized: false,
                    session: '',
                    user: '',
                    role: 'visitor'     // user, admin
                },

                // extend

                isAutorized: function() {
                    return this.authorized
                },

                login: function( username, password, callback ) {
                    // query
                    this.log(
                        'Login:', username,
                        'password:', password );
                    $.post(
                        '/auth/login', {
                            username: username,
                            password: password
                        })
                        .fail( function( def, type, status ) {
                            Backbone.log( 'login: ajax fail', status );
                            callback( new Error( status ));
                        })
                        .done( function( res ) {
                            Backbone.log( 'login: ajax done', res );
                            if ( res.error ) {
                                callback( null, null, res );
                            } else {
                                callback( null, res );
                            }
                        });
                },

                remind: function( email, callback ) {
                    $.post(
                        '/auth/remind', {
                            email: email
                        })
                        .fail( function( def, type, status ) {
                            Backbone.log( 'remind password: ajax fail', status );
                            callback( new Error( status ));
                        })
                        .done( function( res ) {
                            Backbone.log( 'remind password: ajax done', res );
                            callback( null, res );
                        });
                },

                signup: function( form, callback ) {
                    $.post(
                        '/auth/signup',
                        Object( form ))
                        .fail( function( def, type, status ) {
                            Backbone.log( 'signup: ajax fail', status );
                            callback( new Error( status ));
                        })
                        .done( function( res ) {
                            Backbone.log( 'signup: ajax done', res );
                            callback( null, res );
                        });
                }

            }),
            user = new User();

        return user;
    });