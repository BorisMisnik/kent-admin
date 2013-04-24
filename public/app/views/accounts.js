define(
    [
        'libs/app',
        'models/user',
        // css
        'css!/assets/css/login.css'
    ],
    function( app, user ) {
        Backbone.log( 'app.accounts' );

        var Totals = Backbone.Model.extend({
                url: '/accounts/totals'
            }),
            Collection = Backbone.Collection.extend({
                url: '/accounts'
            }),

            Login = Backbone.Layout.extend(
                {
                    // Values

                    collection: new Collection(),
                    totals: new Totals(),
                    list: [],
                    filters: {
                        activate: { active: true, count: 1 },
                        inactive: {},
                        import: {}
                    },
                    itemsPerPage: 20,
                    itemsCount: 1,
                    paginator: {
                        page: 1,
                        prev: 0,
                        next: 0
                    },

                    // Logic

                    template: 'accounts',
                    events: {
                        // filters
                        'click a[data-filter]': 'changeFilter',
                        // items
                        'click [data-action="photo"]': 'showPhoto',
                        'click a[data-action="change"]': 'change',
                        'click a[data-action="allow"]': 'allow',
                        'click a[data-action="deny"]': 'deny',
                        // form
                        'click #submitForm': 'submit'
                    },

                    initialize: function() {
                        // list items
                        this.collection.on( 'sync', this.render, this );
                        this.query();
                        // titals
                        this.totals.on( 'change', this.render, this );
                        this.totals.fetch();
                    },

                    serialize: function() {
                        var list = this.collection.toJSON(),
                            filtered = [],
                            values = {};

                        if ( list.error )
                            // has errors
                            return { error: true, errors: list };

                        // prepate view

                        // buttons
                        _.each( list, function( usr ) {
                            usr.buttons = {};
                            if ( !usr.review )
                                usr.buttons.review = true;
                            else
                            if ( usr.active )
                                usr.buttons.deny = true;
                            else
                                usr.buttons.allow = true;
                        });

                        // paginator
                        this.paginator.prev =
                            1 != this.paginator.page;
                        this.paginator.next =
                            0 < this.itemsCount - this.paginator.page * this.itemsPerPage;

                        // totals
                        console.log(' totals:', this.totals.toJSON() );
                        var totals = this.totals.toJSON();
                        this.filters.activate.count = totals.activate;
                        this.filters.inactive.count = totals.inactive;
                        this.filters.import.count = totals.import;

                        // apply filters
                        filtered = _.filter( list, function( usr ) {
                            var pass = true;
                            if ( pass
                                && this.filters.activate.active )
                                pass = !!usr.active;
                            if ( pass
                                && this.filters.inactive.active )
                                pass = !usr.active;
                            if ( pass
                                && this.filters.import.active )
                                pass = !!usr.imported;
                            return pass;
                        }, this );

                        // load records in need
                        if ( filtered.length < list.length
                            && filtered.length < this.itemsPerPage
                            && this.paginator.next )
                            // to few items, then fetch new
                            this.query();

                        // tepmplate data
                        values = {
                            success: true,
                            list: filtered.slice( 0, this.itemsPerPage ),
                            filters: this.filters,
                            paginator: this.paginator
                        };
                        console.log( 'serialize accounts:', values );
                        return values;
                    },

                    query: function() {
                        var filters = {
                                activate: this.filters.activate.active,
                                inactive: this.filters.inactive.active,
                                import: this.filters.import.active
                            },
                            paginator = {
                                limit: this.itemsPerPage,
                                skip: (( this.paginator.page || 1 ) -1 ) * this.itemsPerPage
                            },
                            data = {
                                filters: filters,
                                paginator: paginator
                            };
                        console.log( 'fetch query:', data );
                        this.collection.fetch({
                            data: data,
                            type: 'POST'
                        });
                    },

                    // Events

                    changeFilter: function( e ) {
                        e.preventDefault();
                        var el = this.$( e.target ),
                            type = el.attr( 'data-filter' ),
                            active = el.parent().hasClass( 'active' );
                        if ( !this.filters[ type ]) return;
                        this.filters[ type ].active = !active;
                        el.parent().toggleClass( 'active' );

                        // radio buttons
                        if ( 'activate' == type )
                            this.filters.inactive.active = false;
                        if ( 'inactive' == type )
                            this.filters.activate.active = false;

                        // render list
                        this.render();
                    },

                    showPhoto: function( e ) {
                        e.preventDefault();
                        var self = this,
                            el = self.$( e.target ),
                            id = ''+ ( el.attr( 'data-account' ) || '' );

                        // get photo (dataURL)
                        var box = self.$( '#modalPhoto' ),
                            img = self.$( '#modalPhotoImage' ),
                            preloader = box.find( '.progress' );

                        // hide old image
                        img.addClass( 'hide' );
                        // show preloader
                        preloader.removeClass( 'hide' );
                        // show modal
                        box.modal();

                        // ajax
                        $.get( '/accounts/id/'+ id +'/photo' )
                            .done( function( res ) {
                                if ( !res || !res.success || !res.photo ) return;
                                // show image
                                preloader.addClass( 'hide' );
                                img.attr( 'src', res.photo )
                                    .removeClass( 'hide' );
                            });
                    },

                    change: function( e ) {
                        e.preventDefault();
                        var self = this,
                            el = this.$( e.target ),
                            id = ''+ ( el.attr( 'data-account' ) || '' );
                        // show modal form
                        self.$( '#modalProfile' ).modal();
                        self.populateForm( self.getItem( id ));
                    },

                    allow: function( e ) {
                        e.preventDefault();
                        var self = this,
                            el = self.$( e.target ),
                            id = ''+ ( el.attr( 'data-account' ) || '' );
                        id &&
                        $.get( '/accounts/id/'+ id +'/permission/allow' )
                            .done( function( res ) {
                                // show
                                var item = self.getItem( id );
                                if ( !item ) return;
                                item.set({ review: true, active: true });
                                self.render();
                                // update totals
                                self.totals.fetch();
                            });
                    },
                    deny: function( e ) {
                        e.preventDefault();
                        var self = this,
                            el = self.$( e.target ),
                            id = ''+ ( el.attr( 'data-account' ) || '' );
                        id &&
                        $.get( '/accounts/id/'+ id +'/permission/deny' )
                            .done( function( res ) {
                                // show
                                var item = self.getItem( id );
                                if ( !item ) return;
                                item.set({ review: true, active: false });
                                self.render();
                                // update totals
                                self.totals.fetch();
                            });
                    },

                    // Data

                    getItem: function( id ) {
                        var list = this.collection.models;
                        if ( !id ) return;
                        return _.find( list, function( usr ) {
                            return usr.get( '_id' ) == id;
                        });
                    },

                    // Form ( modal )

                    submit: function( e ) {
                        e.preventDefault();
                        // get values
                        var self = this,
                            box = self.$( '#modalProfile' ),
                            form = self.$( '#modalProfileForm' ),
                            id = form.attr( 'data-account' );

                        var values = {
                            // name
                            name: form.find( '#name' ).val(),
                            // phone
                            phone: form.find( '#phone' ).val(),
                            // birth date:
                            day: form.find( '#day' ).val(),
                            month: form.find( '#month' ).val(),
                            year: form.find( '#year' ).val(),
                            // email
                            email: form.find( '#email').val(),
                            // password
                            password: form.find( '#password' ).val()
                        };
                        console.log( 'form values:', values );
                        $.post( '/account/profile', values )
                            .fail()
                            .done( function( res ) {
                                if ( res && res.success )
                                    // hide modal
                                    box.modal( 'hide' );
                                    // update list
                                    var item = self.getItem( id );
                                    if ( !item ) return;
                                    item.set( values );
                                    // render
                                    //self.render();
                                    self.collection.fetch();
                                });
                    },
                    populateForm: function( model ) {
                        console.log( 'populdate:', model.toJSON());
                        var self = this,
                            form = self.$( '#modalProfileForm' );
                        // id
                        form.attr( 'data-account', model.get( '_id' ));
                        // name
                        form.find( '#name').val( model.get( 'profile' ).name );
                        // phone
                        form.find( '#phone').val( model.get( 'profile' ).phone );
                        // birth date:
                        form.find( '#day').val( model.get( 'profile' ).day );
                        form.find( '#month').val( model.get( 'profile' ).month );
                        form.find( '#year').val( model.get( 'profile' ).year );
                        // email
                        form.find( '#email').val( model.get( 'profile' ).email );
                        // password
                        form.find( '#password' ).val( model.get( 'password' ));
                    },
                    populateErrors: function( err ) {
                        // hide old errors
                        var self = this,
                            form = self.$( '#modalProfileForm' ),
                            controls = form.find( '[control-group]' );
                        // hide old
                        controls.removeClass( 'error' );
                        // show new
                        _.each( err, function( val, key ) {
                            console.log( 'error:', key );
                            form.find( '.'+ key).addClass( 'error ');
                        })
                    }

                });
        return Login;
    });

Backbone.log( '- accounts' );