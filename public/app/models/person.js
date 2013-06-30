define(
    [],
    function() {

        var Person = Backbone.Model.extend({
                defaults: {
                    name: '',
                    day: '',
                    month: '',
                    year: '',
                    phone: '',
                    email: '',
                    password: '',
                    password2: '',
                    agree_age: false,
                    agree_rules: false,
                    agree_info: false
                }

//                // extend
//
//                remind: function( email, callback ) {
//                    $.post(
//                        '/auth/remind', {
//                            email: email
//                        })
//                        .fail( function( def, type, status ) {
//                            Backbone.log( 'login: ajax fail', status );
//                            callback( new Error( status ));
//                        })
//                        .done( function( res ) {
//                            Backbone.log( 'remind password: ajax done', res );
//                            callback( null, res );
//                        });
//                }

            });

        return Person;
    });