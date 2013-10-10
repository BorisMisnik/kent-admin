define([
	'libs/app'
],
function( app ) {
	var Unsibscrib = 
	Backbone.Collection.extend({
		url: '/unsibscriber',
		parse: function( res, xhr ) {
			// todo: cast error
			if ( !res || res.error ) return;
			// fill collection
			if ( _.isArray( res.success )){
				return res.success;
			}
		}
	}),
	Unsibscrib = Backbone.Layout.extend({
		unsibscrib: new Unsibscrib(),
		template: 'unsibscriber',

		events: {
				// 'click .thinklist-view': 'doView',
				'click .remove': 'doRemove'
		},

		initialize: function() {
			this.listenTo( this.unsibscrib, 'sync', this.render );
			this.unsibscrib.fetch();
		},

		serialize: function() {
			var unsibscrib = this.unsibscrib.toJSON();
			return {
				data: unsibscrib
			};
		},

		doRemove : function(e){
			e.preventDefault();
			var self = this,
				id = this.$( e.target ).attr( '_id' );
				if ( !id ) return;
				$.post( '/unsibscriber/'+ id )
					.done( function( res ) {
						// update list
						self.unsibscrib.fetch();
					});
		}

	});


	return Unsibscrib;
});
