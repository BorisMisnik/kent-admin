define(
    [
        'libs/router',
        'models/user'
    ],
    function( router, user ) {
        Backbone.log( 'app.logged' );

        /**
         * After login
         * Load Desktop-application
         */

        var Logged = Backbone.Layout.extend(
            {
                initialize: function( app ) {

                    //console.log( 'APP arg:', app );

                    if ( user.isAutorized ) load();
                    else
                    self.once( 'change:authorized',function() {
                        if ( user.isAutorized ) load();
                    });

                    // load desktop
                    function load() {
                        require( 'views/desktop',
                            function( desktop ) {
                                //console.log( 'DESKTOP loaded', desktop );
                            });
                    }
                }
            });
            return Logged;
    });