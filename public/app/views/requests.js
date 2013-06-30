define(
[
    'libs/app',
    'views/requests/answer'
    // css
    //'css!/assets/css/login.css'
],
function( app, Form ) {
    var
        RequestsList = Backbone.Collection.extend({
            url: '/feedback',
            parse: function( res, xhr ) {
                // todo: cast error
                if ( !res || res.error ) return;
                // fill collection
                if ( _.isArray( res.success ))
                    return res.success;
            }
        }),
        Requests = Backbone.Layout.extend({

            // Values
            list: new RequestsList(),

            // Logic
            template: 'requests/list',
            events: {
                'click .answerslist-answer': 'doAnswer',
                'click .answerslist-remove': 'doRemove'
            },

            initialize: function() {
                this.listenTo( this.list, 'sync', this.render );
                this.list.fetch();
            },

            serialize: function() {
                var list = [];
                _.each( this.list.toJSON(),
                    function( doc ) {
                        // sort message text
                        doc.message = String( doc.message || '' ).substr( 0, 25 );
                        list.push( doc );
                    });
                return {
                    list: list
                };
            },



            // Events
//
//            galleryCreate: function( e ) {
//                e.preventDefault();
//                var form = new Form();
//                this.listenTo( form, 'update', function() {
//                    this.galleries.fetch(); }, this );
//                this.insertView( '#createForm', form );
//                this.render();
//            },
//
            doAnswer: function( e ) {
                e.preventDefault();
                var id = this.$( e.target ).attr( '_id'),
                    form = new Form({ id: id });
                // update list
                this.listenTo( form, 'update', function() {
                    this.list.fetch();
                }, this );
                this.insertView( '#placeAnswerForm', form );
                this.render();
            },

            doRemove: function( e ) {
                e.preventDefault();
                var self = this,
                    id = this.$( e.target ).attr( '_id' );
                if ( !id ) return;
                var act = confirm( 'Дійсно видалити?' );
                if ( act == true ) {
                    $.post( '/feedback/remove/'+ id )
                        .done( function( res ) {
                            // todo: populate errors
                            if ( !res || !res.success ) return;
                            // update list
                            self.list.fetch();
                        })
                        .fail( this.render );
                }
            }


        });
    return Requests;
});
