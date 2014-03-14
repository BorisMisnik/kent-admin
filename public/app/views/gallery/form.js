define(
[
    'libs/app',
    // css
    'css!/assets/css/fineuploader-3.2.css',
    'css!/assets/css/manage.css'
],
function( app ) {
    var
        Gallery = Backbone.Model.extend({
            urlRoot: '/gallery/get/',
            parse: function( res ) {
                debugger;
                if ( !res || res.error ) return;
                if ( _.isObject( res.success ))
                    return res.success;
            }
        }),
        GalleryForm = Backbone.Layout.extend({

            // Values
            gallery: null,

            // Logic
            template: 'gallery/form',
            events: {
                'click .form-submit': 'formSubmit',
                'click .form-reset': 'formReset',
                'click .form-close': 'formClose',
                'click .photo-remove': 'photoRemove'
            },

            initialize: function() {
                this.gallery = new Gallery({ id: this.id });
                this.gallery.on( 'sync', this.render, this );
                if ( this.id ) this.gallery.fetch();
            },

            serialize: function() {
                return {
                    errors: null,
                    values: this.gallery.toJSON(),
                    create: ! this.id,
                    uploader: !! this.id
                };
            },


            afterRender: function() {
                var self = this;
                var added = [];

                // hooks

                // init uploader
                this.$( '#thumbnail-fine-uploader' )
                    .fineUploader({
                        request: {
                            endpoint: '/gallery/photo/uploadd/'+ self.gallery.get( 'id' )
                        },
                        maxConnections: 2,
                        multiple: true,
                        validation: {
                            allowedExtensions: [ 'jpeg', 'jpg', 'gif', 'png' ]
                        },
                        text: {
                            uploadButton: 'Click or Drop'
                        }
                    })
                    .on( 'complete',
                        function( event, id, fileName, res ) {
                            console.log( 'complete upload', arguments );
                            if ( res.success ) {
                                if (!~added.indexOf( id )) {
                                    // prevent fineUploader bug: multiple event cast
                                    added.push( id );
                                    console.log( 'complete upload', arguments );
                                    var el = $( '<div class="thumb">\
                                            <img src="/photos/'+ res.name +'_small.'+ res.ext +'" />\
                                            <a class="photo-remove btn btn-block btn-danger capt" _id="'+ res.id +'" _name="'+ res.name +'">Видалити</a>\
                                            </div>' );
                                    self.$( '.thumbnails' ).append( el );
                                }
                                //self.gallery.fetch();
                            }
                        });
            },

            formValues: function() {
                var pairs = this.$( '.galleryForm' ).serializeArray(),
                    res = {};
                _.each( pairs, function( v ) {
                    if ( v ) res[ v.name ] = v.value;
                }, this );
                return res;
            },

            formSubmit: function( e ) {
                e.preventDefault();
                var self = this;
                console.log( 'form', self.formValues() );
                if ( !self.id )
                    // create
                    $.post( '/gallery/create', self.formValues() )
                        .done( function( res ) {
                            // todo: populate errors
                            if ( !res || !res.success ) return;
                            self.trigger( 'update' );
                        });
                else
                    // update
                    $.post( '/gallery/update/'+ self.id, self.formValues() )
                        .done( function( res ) {
                            // todo: populate errors
                            if ( !res || !res.success ) return;
                            // close form and update list
                            self.trigger( 'update' );
                        });
            },
            formClose: function( e ) {
                e.preventDefault();
                // trigger event if has changes
                // self.trigger( 'update' );
                // or simple close if not
                this.remove();
            },

            photoRemove: function( e ) {
                e.preventDefault();
                var self = this,
                    gallery_id = this.$( e.target ).attr( '_id' ),
                    photo_name = this.$( e.target ).attr( '_name' );
                if ( !gallery_id || !photo_name ) return;
                $.post( '/gallery/photo/remove/'+ gallery_id +'/'+ photo_name )
                    .done( function( res ) {
                        // todo: populate errors
                        if ( !res || !res.success ) return;
                        // update photos list ( with form )
                        self.gallery.fetch();
                    });
            }

        });
    return GalleryForm;
});
