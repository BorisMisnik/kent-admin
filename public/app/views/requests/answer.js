define(
[
    'libs/app',
    // css
    'css!/assets/css/fineuploader-3.2.css',
    'css!/assets/css/manage.css'
],
function( app ) {
    var
        Answer = Backbone.Model.extend({
            urlRoot: '/feedback/',
            parse: function( res ) {
                if ( !res || res.error ) return;
                if ( _.isObject( res.success ))
                    return res.success;
            }
        }),
        AnswerForm = Backbone.Layout.extend({

            // Values
            answer: null,

            // Logic
            template: 'requests/answer',
            events: {
                'submit .answerForm': 'formSubmit',
                'click .answer-reset': 'formReset',
                'click .answer-close': 'formClose',
                'click .answer-remove': 'formRemove'
            },

            initialize: function() {
                this.answer = new Answer({ id: this.id });
                this.answer.on( 'sync', this.render, this );
                if ( this.id ) this.answer.fetch();
            },

            serialize: function() {
                return {
                    errors: null,
                    values: this.answer.toJSON(),
                    answered: !! this.answer.get( 'answered' )
                };
            },

            formValues: function() {
                var pairs = this.$( '.answerForm' ).serializeArray(),
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
                // answer
                $.post( '/feedback/answer/'+ self.id, self.formValues() )
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
            formRemove: function( e ) {
                e.preventDefault();
                // removing
                var self = this,
                    id = this.$( e.target ).attr( '_id' );
                if ( !id ) return;
                var act = confirm( 'Дійсно видалити?' );
                if ( act == true ) {
                    $.post( '/feedback/remove/'+ id )
                        .done( function( res ) {
                            // todo: populate errors
                            if ( !res || !res.success ) return;
                            end();
                        })
                        .fail( end );
                }
                function end() {
                    // close form and update list
                    self.trigger( 'update' );
                }
            }

        });
    return AnswerForm;
});
