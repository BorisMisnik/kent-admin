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

                //urlRoot: '/auth/account',
                defaults: {
                    authorized: false,
                    session: '',
                    user: ''
                    // role: 'visitor'     // user, admin
                },

                // extend

                isAutorized: function() {
                    return this.get( 'authorized' );
                },

                account: function() {
                    var self = this;
                    self.unset( 'user' );
                    $.get( '/account' )
                        .fail( function( def, type, status ) {
                            Backbone.log( 'account: ajax fail:', arguments );
                            self.set( 'authorized', false );
                        })
                        .done( function( res ) {
                            Backbone.log( 'account: ajax done', arguments );
                            var success = !!( res && res.success );
                            self.set( 'authorized', success );
                            if ( success ) {
                                delete res.authorized;
                                self.set( 'user', res );
                                // todo: self.set( 'user', { login:res.login || '', ... } );
                            }
                        });
                },

                login: function( username, password, callback ) {
                    var self = this;
                    // query
                    self.log(
                        'Login:', username,
                        'password:', password );
                    $.post(
                        '/account/login', {
                            username: username,
                            password: password
                        })
                        .fail( function( def, type, status ) {
                            //console.log( 'login: ajax fail:', arguments );
                            Backbone.log( 'login: ajax fail', status );
                            // update
                            self.set( 'authorized', false );
                            // Unauthorized
                            if ( 401 == def.status )
                                // credentials error
                                callback( null, null, { wrong_credentials: true });
                            else
                                // fatal error
                                callback( new Error( status ));
                        })
                        .done( function( res ) {
                            Backbone.log( 'login: ajax done', arguments );
                            // update
                            self.set( 'authorized', res );
                            // callback
                            if ( res.error )
                                // report error
                                callback( null, null, res );
                            else
                            if ( res.success )
                                // logged in
                                callback( null, res );
                            else
                                callback( null, null, { unknown_error: res });
                        });
                },

                logout: function() {
                    // query
                    $.get( '/account/logout' )
                        .fail( function( def, type, status ) {
                            Backbone.log( 'logout: ajax fail', status );
                            callback( new Error( status ));
                        })
                        .done( function( res ) {
                            Backbone.log( 'logout: ajax done', res );
                            if ( res.error )
                                callback( null, null, res );
                            else
                                callback( null, res );
                            // update
                            this.set( 'authorized', false );
                        });
                },

                remind: function( email, callback ) {
                    $.post(
                        '/account/remind', {
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
                        '/account/signup',
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

        // events: logged, logout
        user.on( 'change:authorized',
            function( model, value ) {
                if ( !!value )
                    this.trigger( 'logged' );
                else
                    this.trigger( 'logout' );
            }, user );
        // first to update from server
        user.account();
        // singleton
        return user;
    });