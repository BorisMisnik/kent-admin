define(
    [
        'libs/router',
        'models/user',
        // css
        'css!/assets/css/login.css'
    ],
    function( router, user ) {
        Backbone.log( 'app.login' );

        var errors = {
                wrong_credentials: 'Неправильно введено логін або пароль. Спробуй ще раз.'
            },

            Model = Backbone.Model.extend({
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
                    'click #submitLogin': 'login'
                },
                model: new Model(),

                initialize: function() {
                },

                serialize: function() {
                    // prepare errors
                    var data = { errors: [] };
                    _.each( this._errors,
                        function( val, key ) {
                            data.errors.push( errors[ key ]);
                        });
                    // form values
                    data.form = this.model.toJSON();
                    this.log( 'login form data:', data );

                    //debug
                    data.result = Math.random().toString( 16 ).substr( 2 );

                    return data;
                },
                afterRender: function() {
                    // custom form fields
                    //form.init();
                },

                _errors: {},

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

                    // query
                    user.login(
                        username, password,
                        function( err, res, fail ) {
                            if ( err ) return;
                            if ( fail
                                || !res
                                || !res.authorized ) {
                                // show error
                                self._errors = fail;
                                self.render();
                            }
                            else {
                                window.location.href = '/main.html';
                                //router.navigate( '/main.html' );
                                //self.log( 'goto: #!/main' );
                            }
                        });
                }
            }),
            login = new Login();
            return login;
    });