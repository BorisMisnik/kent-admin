var mongo = require( 'mongodb' ),
    users = require( './users.json' );

var client = new mongo.Db( 'kent',
    new mongo.Server("127.0.0.1", 27017, {}), {w: 1});

var count = 0,
    initcounter = 2,
    cAccounts, cCards;

client.open( function( err, p_client ) {
    client.collection( 'accounts',
        function ( err, _cAccounts ) {
            cAccounts = _cAccounts;
            if ( ! --initcounter ) init();
        });
    client.collection( 'cards',
        function ( err, _cCards ) {
            cCards = _cCards;
            if ( ! --initcounter ) init();
        });
});

function init( ) {

    var key;
    for ( key in users ) {
        !function( key ) {

            console.log( '* user:', key );
            var user = users[ key ];
            if ( !user ) return;

            var account = {
                active: false,
                login: user.email,
                password: user.password,
                hash: '',
                role: 'visitor'
            };
            var profile = {
                account_id: null,
                type: 'profile',
                name: user.name,
                agree_age: true,
                agree_info: true,
                agree_rules: true,
                brand1: '',
                brand2: '',
                sku1: '',
                sku2: '',
                day: user.day,
                month: user.month,
                year: user.year,
                password: user.password,
                email: user.email,
                phone: user.phone,
                photo: user.photo
            };

            // add account
            cAccounts.insert( account, function( err, docs ) {
                if ( err ) {
                    console.log( 'Database Error (1):', err );
                    return;
                }
                var doc = docs && docs.shift();
                if ( !doc ) return;

                profile.account_id = new mongo.ObjectID( ''+ doc._id );

                // add card
                cCards.insert( profile, function( err, docs ) {
                    if ( err ) {
                        console.log( 'Database Error (2):', err );
                        return;
                    }
                    var card = docs && docs.shift();
                    console.log( ++count + ') Added (account/profile) ids:', doc.login, doc._id, card._id );
                })
            });

        }( key );
    }
}


//            collection.insert({a:2}, function(err, docs) {
//
//                collection.count(function(err, count) {
//                    test.assertEquals(1, count);
//                });
//
//                // Locate all the entries using find
//                collection.find().toArray(function(err, results) {
//                    test.assertEquals(1, results.length);
//                    test.assertTrue(results[0].a === 2);
//
//                    // Let's close the db
//                    client.close();
//                });
//            });

