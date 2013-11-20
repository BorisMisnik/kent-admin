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
		itemsPerPage: 10,
        itemsCount: 1,
		paginator: {
			page: 1,
			prev: 0,
			next: 0
		},
		events: {
				'click .thinklist-view': 'doView',
				'click .thinklist-remove': 'doRemove',
				'click .next': 'pageNext',
				'click .previous': 'pagePrev',
				'click .profile-view' : 'profileView',
				'click .profile-foto ' : 'profilePhoto'
		},

		initialize: function() {
			this.listenTo( this.thinks, 'sync', this.render );
			//this.galleries.on( 'sync', this.render, this );
			this.thinks.fetch();
		},

		serialize: function() {
			var thinks = this.thinks.toJSON();
			var self = this;
			this.paginator.prev =
				1 != this.paginator.page;
			this.paginator.next =
				thinks.length == this.itemsPerPage;

			return {
				thinks: thinks,
				paginator: this.paginator
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
		},
		pageNext: function( e ) {
			e.preventDefault();
			console.log( this.paginator.page );
			console.log( this.itemsPerPage );
			console.log( this.itemsCount );
			// if ( this.paginator.page * this.itemsPerPage <= this.itemsCount ) {
				this.paginator.page++;
				this.query();
			// }
		},

		pagePrev: function( e ) {
			e.preventDefault();
			if ( this.paginator.page > 1 ) {
				this.paginator.page--;
				this.query();
			}
		},

		query: function(e){
			var data  = {
				limit: this.itemsPerPage,
				skip: (( this.paginator.page || 1 ) -1 ) * this.itemsPerPage
			};


			this.thinks.fetch({
				data: data,
				type: 'GET'
			});

		},

		profileView : function(e){
			var id = $(e.target).attr('_id');
			var self = this;
			// ajax
			$.get( '/account', {_id : id})
				.done( function( res ) {
					self.populateForm( res.profile );
				});
			return false;
		},

		profilePhoto : function(e){
			var id = $(e.target).attr('_id');
			// ajax
			$.get( '/accounts/id/'+ id +'/photo' )
				.done( function( res ) {
					if ( !res || !res.success || !res.photo ) return;
					// show image
					$('#modalPhotoImage').attr( 'src', res.photo )
					$('#modalPhoto').modal('show');
				});

			return false;
		},
		populateForm: function( model ) {
						//console.log( 'populdate:', model.toJSON());
			var self = this,
				form = $( '#modalProfile' );
			// id
			form.attr( 'data-account', model._id);
			// name
			form.find( '#name').val( model.name );
			// phone
			form.find( '#phone').val( model.phone );
			// birth date:
			form.find( '#day').val( model.day );
			form.find( '#month').val( model.month );
			form.find( '#year').val( model.year );
			// email
			form.find( '#email').val( model.email );
			// password
			form.find( '#password' ).val( model.password);

			form.modal('show');
		}

	});


	return Think;
});
