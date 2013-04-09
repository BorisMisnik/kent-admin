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
         * @type {Array}
         */

        var itemsList = [
                { url: '/requests', title: 'Профiлi користувачiв' },
                { url: '/faq', title: 'Вiдповiдi на запитання' },
                { url: '/logs', title: 'Журнали та звіти' },
                { url: '/import', title: 'Імпорт до бази' }
            ],
            Menu = Backbone.Layout.extend(
            {
                template: 'menu',
                events: {
                    //'click #submitLogin': 'login'
                },
                items: new Backbone.Collection( itemsList ),
                serialize: function() {
                    return { items: this.items.toJSON() };
                },
                afterRender: function() {
                    console.log( this.$el.html());
                },

                activate: function( id ) {
                    // get item el
                    // activate
                }
            }),
            menu = new Menu();
            return menu;
    });