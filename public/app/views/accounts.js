define(
    [
        'libs/app',
        'models/user',
        // css
        'css!/assets/css/login.css'
    ],
    function( app, user ) {
        Backbone.log( 'app.accounts' );

        var Model = Backbone.Model.extend({}),
            Collection = Backbone.Collection.extend({
                //model: Model,
                url: '/accounts'
            }),

            Login = Backbone.Layout.extend(
                {
                    template: 'accounts',
                    events: {
                        'click [data-action="photo"]': 'showPhoto',
                        'click a[data-action="change"]': 'change',
                        'click a[data-action="allow"]': 'allow',
                        'click a[data-action="deny"]': 'deny'
                    },
                    //model: new Model(),
                    collection: new Collection(),
                    list: [],

                    initialize: function() {
                        this.collection.fetch();
                        this.collection.on( 'sync', this.render, this );
                    },

                    prepareData: function() {
                        var data,
                            list = this.collection.toJSON();

                        // clear list
                        this.list.reset();

                        // errors
                        if ( list.error ) {
                            // server return errors ( on fetch )
                            this._errors = { error: true, errors: list };
                            return;
                        }

                        this.list = list;
                        console.log( 'prepared accounts:', data );
                        // results
                        return list;
                    },

                    serialize: function() {
                        var list = this.list.toJSON(),
                            values = {};

                        if ( list.error )
                            // has errors
                            return { error: true, errors: list };

                        _.each( list, function( usr ) {
                            usr.buttons = {};
                            if ( usr.reviewed ) {
                                if ( usr.active )
                                    usr.buttons.deny = true;
                                else
                                    usr.buttons.allow = true;
                            } else {
                                usr.buttons.allow = true;
                                usr.buttons.deny = true;
                            }
                        });

                        // show list of profiles
                        values = {
                            success: true,
                            list: list,
                            filters: {
                                activated: { active: true, count: 1 },
                                deactivated: {},
                                imported: {}
                            },
                            paginator: {
                                prev: 0,
                                page: 1,
                                next: 2
                            }
                        };
                        // show list of profiles
                        console.log( 'serialize accounts:', values );
                        return values;
                    },
                    beforeRender: function() {
                    },

                    // Events
                    showPhoto: function( e ) {
                        e.preventDefault();
                        var el = this.$( e.target );
                        console.log( 'showPhoto', el.attr( 'data-action' ), el.attr( 'data-account' ));
                        debugger;
                    },
                    change: function( e ) {
                        e.preventDefault();
                        var el = this.$( e.target );
                        console.log( 'change', el.attr( 'data-action' ), el.attr( 'data-account' ));
                    },
                    allow: function( e ) {
                        e.preventDefault();
                        var el = this.$( e.target );
                        console.log( 'allow', el.attr( 'data-action' ), el.attr( 'data-account' ));
                    },
                    deny: function( e ) {
                        e.preventDefault();
                        var self = this,
                            el = self.$( e.target),
                            id = ''+ ( el.attr( 'data-account' ) || '' );
                        console.log( 'deny', el.attr( 'data-action' ), el.attr( 'data-account' ));

                        $.get( '/accounts/id/'+ id +'/deny' )
                            .fail( function( xhr, status, err ) {
                                console.log( 'deny fail:', arguments );
                            })
                            .done( function( res ) {
                                console.log( 'deny success:', arguments );
                                //self.collection.fetch();

                                // switch buttons
                                //this.

//                                this.$( 'a[data-action="allow"][data-account="'+ id +'"]' )
//                                    .removeClass( 'hide' );
//                                this.$( 'a[data-action="deny"][data-account="'+ id +'"]' )
//                                    .addClass( 'hide' );

                            });
                    }
                });
        return Login;
    });

Backbone.log( '- accounts' );