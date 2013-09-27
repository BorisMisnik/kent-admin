define([
	'libs/app'
],
function( app ) {
	var Thinks = 
	Backbone.Collection.extend({
		url: '/think',
		parse: function( res, xhr ) {
			// todo: cast error
			if ( !res || res.error ) return;
			// fill collection
			if ( _.isArray( res.success )){
				return res.success;
			}
		}
	}),
	Think = Backbone.Layout.extend({
		thinks: new Thinks(),
		template: 'think',

		initialize: function() {
			this.listenTo( this.thinks, 'sync', this.render );
			//this.galleries.on( 'sync', this.render, this );
			this.thinks.fetch();
		},
		serialize: function() {
			var thinks = this.thinks.toJSON();
			// return {
			// 	thinks: list
			// };
		}
	});


	return Think;
});
