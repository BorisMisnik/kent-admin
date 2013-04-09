define(
    [
        'libs/router',
        'models/user',
    ],
    function( router, user ) {
        Backbone.log( 'app.menu' );

        /**
         * Menu generator
         * todo: sync with server ater login, to show actual menu for current user
         * @type {Array}
         */

        var itemsList = [
                { url: '/manage/requests', title: 'Профiлi користувачiв' },
                { url: '/manage/faq', title: 'Вiдповiдi на запитання' }
            ],
            Items = Backbone.Collection( itemsList ),
            Login = Backbone.Layout.extend(
            {
                template: 'login',
                events: {
                    'click #submitLogin': 'login'
                },
                items: new Items(),
                serialize: function() {
                    return this.items.toJSON();
                }
            }),
            login = new Login();
            return login;
    });