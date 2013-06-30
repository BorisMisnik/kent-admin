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
                    // state: 'login'
                }
            }),
            registry = new Registry();

        return registry;
    });