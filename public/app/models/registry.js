/*!
 * Module: Module
 *
 * @author Andjey Guzhovskiy, <me.the.ascii@gmail.com>
 * @copyright (c) 2013 Andjey Guzhovskiy
 * @licence CLOSED
 * @version 0.0.1
 */

// singleton

define(
    [],
    function() {

        /**
         * Application Main Registry
         */
        var Registry = Backbone.Model.extend({
                defaults: {
                    // Application State
                    state: 'login'
                }
            }),
            registry = new Registry();

        return registry;
    });