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

		events: {
				'click .thinklist-view': 'doView',
				'click .thinklist-remove': 'doRemove'
		},

		initialize: function() {
			this.listenTo( this.thinks, 'sync', this.render );
			//this.galleries.on( 'sync', this.render, this );
			this.thinks.fetch();
		},

		serialize: function() {
			var thinks = this.thinks.toJSON();
			return {
				thinks: thinks
			};
		},

		doView : function(e){
			e.preventDefault();
			var id = this.$( e.target ).attr( '_id');
			var _this = this;
			$.get('think/' + id)
				.done(function(result){
					var result = result.success.message;
					_this.showThink(result);
				});	
		
		},

		doRemove : function(e){
			e.preventDefault();
			var self = this,
				id = this.$( e.target ).attr( '_id' );
				if ( !id ) return;
				$.post( '/think/remove/'+ id )
					.done( function( res ) {
						// update list
						self.thinks.fetch();
					});
		},

		showThink : function(data){
			$('.title').nextAll('tr').remove();
			var template = '';
			for( key in data ){
				if( key === 'user' ) continue;
				template += '<tr>';
					template += '<td>' + key + '</td>';
					template += '<td>' + data[key] + '</td>';
				template += '</tr>';
			}	
			$('#views').show();
			$(template).insertAfter('.title');
		}

	});


	return Think;
});
