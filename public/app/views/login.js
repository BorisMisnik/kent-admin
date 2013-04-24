define(
    [
        'libs/app',
        'models/user',
        // css
        'css!/assets/css/login.css'
    ],
    function( app, user ) {
        Backbone.log( 'app.login' );

        var Model = Backbone.Model.extend({
                defaults: {
                    username: '',
                    password: '',
                    remember: false
                    // todo: remember me
                }
            }),

            Login = Backbone.Layout.extend(
            {
                template: 'login',
                events: {
                    'click .submit': 'login'
                },
                model: new Model(),

                initialize: function() {
                    // already logged in
                    user.on( 'logged', this.onLogged, this );
                    user.on( 'logout', this.onLogout, this );
                },

                _errors: null,
                serialize: function() {
                    var data = {
                        errors: this._errors,
                        form: this.model.toJSON()
                    };
                    this.log( 'login form data:', data );
                    return data;
                },
                beforeRender: function() {
                    if ( user.isAutorized() )
                        this.onLogged();
                },

                // Events

                login: function( e ) {
                    e.preventDefault();

                    // values
                    var self = this,
                        username = self.$( '#username' ).val(),
                        password = self.$( '#password' ).val();
                    self.model
                        .set( 'username', username )
                        .set( 'password', password );
                    self._errors = {};

                    // check values
                    if ( !username || !password ) {
                        self._errors = {
                            no_username: !username,
                            no_password: !password
                        };
                        return self.render();
                    }

                    // query
                    user.login(
                        username, password,
                        function( err, res, fail ) {
                            if ( err ) return;
                            if ( fail ) {
                                // show error
                                self._errors = fail;
                            }
                            else {
                                self._errors = null;
                                self.onLogged();
                            }
                            self.render();
                        });
                },

                onLogged: function() {
                    // * * *
                    // switch application to `desktop` screen
                    //app.state( 'desktop' );
                    Backbone.log( 'login.onLogged' );
                    this.$el.hide();
                },
                onLogout: function() {
                    Backbone.log( 'login.onLogout' );
                    this.$el.show();
                    this.render();
                }
            });
            return Login;
    });

//console.log( '- login' );