define(
[
    'libs/app',
    'views/gallery/form'
    // css
    //'css!/assets/css/login.css'
],
function( app, Form ) {
    var
        Galleries = Backbone.Collection.extend({
            url: '/gallery',
            parse: function( res, xhr ) {
                // todo: cast error
                if ( !res || res.error ) return;
                // fill collection
                if ( _.isArray( res.success ))
                    return res.success;
            }
        }),
//        Photos = Backbone.Collection.extend({
//            url: '/gallery'
//        }),

        Gallery = Backbone.Layout.extend({

            // Values
            galleries: new Galleries(),
//            photos: new Photos(),

            // Logic
            template: 'gallery/list',
            events: {
                'click .add-new': 'galleryCreate',
                'click .action-edit': 'galleryEdit',
                'click .action-remove': 'galleryRemove'
            },

            initialize: function() {
                this.listenTo( this.galleries, 'sync', this.render );
                //this.galleries.on( 'sync', this.render, this );
                this.galleries.fetch();
            },

            serialize: function() {
                return {
                    galleries: this.galleries.toJSON()
                };
            },


            // Events

            galleryCreate: function( e ) {
                e.preventDefault();
                var form = new Form();
                this.listenTo( form, 'update', function() {
                    this.galleries.fetch(); }, this );
                this.insertView( '#createForm', form );
                this.render();
            },

            galleryEdit: function( e ) {
                e.preventDefault();
                var id = this.$( e.target ).attr( '_id' ),
                    form = new Form({ id: id });
                // update list
                this.listenTo( form, 'update', function() {
                    this.galleries.fetch(); }, this );
                this.insertView( '#createForm', form );
                this.render();
            },

            galleryRemove: function( e ) {
                e.preventDefault();
                var self = this,
                    id = this.$( e.target ).attr( '_id' );
                if ( !id ) return;
                var act = confirm( 'Дійсно видалити?' );
                if ( act == true ) {
                    $.post( '/gallery/remove/'+ id )
                        .done( function( res ) {
                            // todo: populate errors
                            if ( !res || !res.success ) return;
                            // update list
                            self.galleries.fetch();
                        })
                }
            }


        });
    return Gallery;
});
