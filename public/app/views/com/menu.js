
// singleton

define(
    [
        'libs/router',
        'models/registry',
        'models/user'
    ],
    function( router, registry, user ) {
        Backbone.log( 'app.menu' );

        /**
         * Menu generator
         * todo: sync with server ater login, to show actual menu for current user
         * (!) Singleton
         */

        var items = new Backbone.Collection( [], {
                model: Backbone.Model,
                url: '/menu/items'
            }),
            Menu = Backbone.Layout.extend(
            {
                template: 'menu',
                items: items,

                initialize: function() {
                    var self = this;
                    // observe items changes
                    self.items.on( 'sync', function() {
                        // add routes
                        _.each( this.items.toJSON(),
                            function( item ) {
                                router.addStateRoute( '!' + item.url, item.state, item.path );
                            });
                        // show items
                        self.render();
                    }, this );

                    // wail for login
//                    user.on( 'change:authorized', function(){
//                        self.items.fetch();
//                    });
                    user.on( 'logged', function(){
                        self.items.fetch();
                    });
                    user.on( 'logout', function(){
                        self.items.fetch();
                    });
                    // get current items
                    self.items.fetch();
                },

                serialize: function() {
                    var items = this.items.toJSON();
                    return { items: items };
                },

                // Events

                change: function( e ) {
                    e.preventDefault();
                },

                // API

                activate: function( state ) {
//                    var activeItem = state || registry.get( 'state' ),
//                        el = this.$( '[data-state='+ activeItem +']' );
                    // todo: activate current item in menu
                }
            }),
            // singleton
            menu = new Menu();
            return menu;
    });

//console.log( '- menu' );