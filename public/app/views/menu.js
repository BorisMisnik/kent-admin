define(
    [
        'libs/router',
        'models/user'
    ],
    function( router, user ) {
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
                        self.render();
                    });
                    // wail for login
                    user.on( 'change:authorized', function(){
                        self.items.fetch();
                    });
                    // get current items
                    self.items.fetch();
                },

                serialize: function() {
                    return { items: this.items.toJSON() };
                },

                // Events

                change: function( e ) {
                    e.preventDefault();
                },

                // API

                activate: function( id ) {
                    // get item el
                    // activate
                }
            }),
            menu = new Menu();
            return menu;
    });

console.log( '- menu' );