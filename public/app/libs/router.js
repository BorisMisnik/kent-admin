/*!
 * Module: Module
 *
 * @author Andjey Guzhovskiy, <me.the.ascii@gmail.com>
 * @copyright (c) 2013 Andjey Guzhovskiy
 * @licence CLOSED
 * @version 0.0.1
 */

define(
    [ '../models/registry' ],
    function( registry ) {


        /**
         * Routes url
         */
        var Router = Backbone.Router.extend(
            {
                routes: {
                    '': 'login',
                    '!/login': 'login',
                    '!/register': 'register',
                    '!/upload': 'upload',
                    '!/webcam': 'webcam',
                    '!/thanks': 'thanks',
                    '!/remind': 'remind',
                    '!/rules': 'rules',
                    '!/feedback': 'feedback'
                },

                // handlers

                // login form
                login: function() {
                    registry.set({ state: 'login' });
                },
                // registration form
                register: function() {
                    registry.set({ state: 'register' });
                },
                // upload image form
                upload: function() {
                    registry.set({ state: 'upload' });
                },
                // webcam shot
                webcam: function() {
                    registry.set({ state: 'webcam' });
                },
                // remind password
                remind: function() {
                    registry.set({ state: 'remind' });
                },
                // thanks
                thanks: function() {
                    registry.set({ state: 'thanks' });
                },
                // rules
                rules: function() {
                    registry.set({ state: 'rules' });
                },
                // feedback form
                feedback: function() {
                    registry.set({ state: 'feedback' });
                }
            }),
            router = new Router();

        // init

        Backbone.history.fragment = null;
        Backbone.history.start(); // { pushState: true });
        //router.navigate( location.hash, true );

        return router;

    });

