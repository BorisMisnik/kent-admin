define([
	'libs/app'
],
function( app ) {
	var Thinks = 
	Backbone.Collection.extend({
		url: '/passwords',
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
		template: 'passwords',

		events: {
				'click #cratePasswords': 'cratePasswords'
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
		cratePasswords : function(e){
			e.preventDefault();
			$('.alert').hide();
			$('#downloadListPasswords, #cratePasswords')
				.attr('disabled', true)
				.css('opacity', .5);

			$.get('/cratePasswords', function(result){
				if( result !== 'success' ){
					$('.alert')
						.show()
						.removeClass()
						.addClass('alert alert-error');
				} else {
					$('.alert')
						.show()
						.removeClass()
						.addClass('alert alert-success');

					$('#downloadListPasswords, #cratePasswords')
						.attr('disabled', false)
						.css('opacity', 1);
				}
				
			});
		}

	});


	return Think;
});
