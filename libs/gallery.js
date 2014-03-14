/*!
 * Module: Module
 *
 * @author Andjey Guzhovskiy, <me.the.ascii@gmail.com>
 * @copyright (c) 2013 Andjey Guzhovskiy
 * @licence CLOSED
 * @version 0.0.1
 */

var server = require( 'piezo-server' ),
    colors = require( 'colors' ),
    cards = server.libs.cards,
    check = server.utils.check,
    filter = server.utils.filter,
    ObjectID = server.utils.ObjectID,
    parent = server.utils.parent,
    // file system
    path = require( 'path' ),
    fs = require( 'fs' ),
    gm = require( 'gm' ).subClass({ imageMagick: true }),
    // locals
    gallery = 'gallery',
    uploadsPath = path.join( path.dirname( parent.first().filename ), '/public/photos/' ),
    middleSize = 490,
    smallSize = 151;


// Gallery
// -------

// get gallery list
exports.galleryList = function( req, res ) {
    cards.list(
        { type: gallery },
        { limit: 100 },
        function( err, list ) {
            if ( err ) res.send({ error: { database: true }});
            else res.send({ success: list.length ? list : [] });
        });
};

// download photo file
exports.photoDownload = function( req, res ) {
    console.log( 'Download photo', req.url, req.params, uploadsPath );
    var photo = req.params.photo;
    if ( !photo ) return res.send( 404 );
    res.download( uploadsPath + photo,
        function( err ) {
            console.log( 'download error'.red.bold, err );
            res.send( 404 );
        });
};

// galleryAllPhotos
exports.galleryAllPhotos = function( req, res ) {
    debugger;
    cards.list(
        { type: gallery },
        { limit: 100 },
        function( err, list ) {
            if ( err ) return res.send({ error: { database: true }});
            if ( !list || !list.length) return res.send({ success: [] });

            // parse each photos from responce (for each album)
            var photos = [],
                url = '/photos/';
            list.forEach( function( album ) {
                if ( !album || !album.photos || !album.photos.length ) return;
                album.photos.forEach( function( photo ) {

                    photos = photos.concat({
                        'large-photo': url + photo.name + '.' + photo.ext,
                        'big-photo': url + photo.name + '_middle.' + photo.ext,
                        'medium-photo': url + photo.name + '_small.' + photo.ext
                    });

                });
            });
            res.send({ success: photos });

        });
};

// get gallery by id
exports.galleryGet = function( req, res ) {
    var id = ObjectID( req.params.id );
    if ( !id ) return res.send({ error: { arguments: true }});
    var query = {
        _id: id,
        type: gallery
    };
    cards.get( query, function( err, doc ) {
        if ( err ) res.send({ error: { database: true }});
        if ( !doc ) res.send({ error: { not_found: true }});
        else res.send({ success: doc });
    });
};

// create new gallery
exports.galleryCreate = function( req, res ) {
    var values = req.body;
    // fields
    values.type = gallery;
    values.photos = [];
    values.photonums = 0;
    // create
    cards.create(
        values,
        function( err, created ) {
            if ( err ) res.send({ error: { database: true }});
            else res.send({ success: created });
        });
};

// update existing gallery
exports.galleryUpdate = function( req, res ) {
    var id = ObjectID( req.params.id ),
        values = req.body;
    if ( !id ) return res.send({ error: { arguments: true }});
    values.type = gallery;
    cards.update(
        { _id: id },
        values,
        function( err, updated ) {
            if ( err ) res.send({ error: { database: true }});
            else res.send({ success: updated });
        });
};

// remove gallery
exports.galleryRemove = function( req, res ) {
    var id = ObjectID( req.params.id );
    if ( !id ) return res.send({ error: { arguments: true }});
    cards.remove(
        { type: gallery, _id: id },
        function( err, docs ) {
            var removed = docs && docs.shift();
            if ( err ) return res.send({ error: { database: true }});
            if ( removed && removed.photos ) {
                // remove files
                removed.photos.forEach(
                    function( v ) {
                        // unlink
                        debugger;
                        fs.unlink( uploadsPath +'/'+ v.name + '.' + v.ext );
                        fs.unlink( uploadsPath +'/'+ v.name +'_middle.'+ v.ext );
                        fs.unlink( uploadsPath +'/'+ v.name +'_small.'+ v.ext );
                        console.log( 'remove:', uploadsPath +'/'+ v.name + v.ext, 'and _middle, _small' );
                    });
            }
            // results
            res.send({ success: removed });
        });
};


// Gallery Content
// ---------------

// Photos
// ------

exports.photoUpload = function( req, res ) {
    var gallery_id = ObjectID( req.params.id ),
        // upload
        file = ( req.files || {} ),
        photo = file.qqfile,
        ext = photo && photo.type && String( photo.type ).replace( /^image\//, '' ), // path.extname( photo.path ),
        name = photo && path.basename( photo.path, ext ),
        types = [ '' ],
        count = 3;

    // todo: convert file
    console.log('debugger');
    debugger;
    console.log('debugger');
    //console.log( 'file:', id, photo, name );
    console.log( req.files );

    if ( !gallery_id || !photo || !ext || ( !photo.size && !photo.length ))
        // FineUploader JSON Results (!)
        return res.end(
            JSON.stringify({ success: false }),
            { 'Content-Type': 'text/plain' },
            404 );

    if ( !photo.length ) photo = [ photo ];

    // original
    console.log('uploadsPath', uploadsPath +'/'+ name +'.'+ ext);
    fs.createReadStream( photo.path )
        .pipe( fs.createWriteStream( uploadsPath +'/'+ name +'.'+ ext ));

    // middle
    gm( photo.path )
        .resize( null, middleSize )     // 490
        .write(
            uploadsPath +'/'+ name +'_middle.'+ ext,
            results );

    // small
    gm( photo.path )
        .resize( null, smallSize )      // 151
        .write(
            uploadsPath +'/'+ name +'_small.'+ ext,
            results );

    cards.update(
        { _id: gallery_id, type: gallery },
        {   $push: { photos: {
                name: name,
                ext: ext,
                likes: 0,
                likers: []
            }},
            $inc: { photonums: 1 }
        },
        results );

    function results( err ) {
        // wait
        console.log('results', count)
        if ( count && --count )
            return;
        // FineUploader JSON Results (!)
        res.send(
            JSON.stringify({
                success: true,
                id: gallery_id,
                name: name,
                ext: ext,
                filename: name +'.'+ ext
            }),
            { 'Content-Type': 'text/plain' },
            200
        );
        // remove temp image file
        if ( photo ) fs.unlink( photo.path, function( err ) {
            if ( err ) console.log( 'temp file remove error'.red.bold, err );
        });
    }
};

exports.photoRemove = function( req, res ) {
    // params
    var gallery_id = ObjectID( req.params.id ),
        name = String( req.params.name || '' );
    if ( !gallery_id || !name ) return res.send({ error: { arguments: true }});
    // remove
    cards.get(
        { _id: gallery_id, type: gallery },
        function( err, doc ) {

            // checkings
            if ( err ) return res.send({ error: { get:true, database: true }});
            if ( !doc ) return res.send({ error: { not_exists: true }});

            // remove files
            console.log( 'removed:', doc );
            doc && doc.photos &&
            doc.photos.forEach(
                function( v, index ) {
                    console.log( 'remove photo:', v );
                    if ( v.name !== name ) return;
                    // remove
                    doc.photos.splice( index, 1 );
                    doc.photonums--;
                    // update gallery record
                    cards.update(
                        { _id: gallery_id, type: gallery },
                        doc,
                        function( err ) {
                            if ( err ) return res.send({ error: { update:true, database: true }});
                            // remove file in fs
                            fs.unlink( uploadsPath +'/'+ v.name +'.'+ v.ext );
                            fs.unlink( uploadsPath +'/'+ v.name +'_middle.'+ v.ext );
                            fs.unlink( uploadsPath +'/'+ v.name +'_small.'+ v.ext );
                            res.send({ success: doc });
                        });
                });
        })
};

// reorder photos
exports.photoReorder = function( req, res ) {
    var gallery_id = ObjectID( req.params.id ),
        photo_id = ObjectID( req.params.photo ),
        position = parseInt( req.params.position );
    if ( !gallery_id || !photo_id || position )
        return res.send({ error: { arguments: true }});
    cards.get(
        { _id: gallery_id },
        function( err, gal ) {
            var photos = gal.photos || [],
                photo = null,
                index = null;
            // checkings
            if ( err ) return res.send({ error: { get:true, database: true }});
            if ( !gal ) return res.send({ error: { not_exists: true }});
            // find photo
            photos.forEach( function( v, i ) {
                if ( v && v.name == photo_id ) index = i;
            });
            if ( !index ) return res.send({ error: { no_photo: true }});
            // reorder
            photo = photos.splice( index, 1 );
            photos.splice( --position, 0, photo );
            cards.update(
                { type: gallery, _id: gallery_id },
                gal,
                function( err, status ) {
                    if ( err ) return res.send({ error: { update: true, database: true }});
                    res.send({ success: { photos: photos }});
                });
        });
};


// Photo Likes
// -----------

exports.likeAdd = function( req, res ) {
    var gallery_id = ObjectID( req.params.id ),
        photo_id = ObjectID( req.params.photo ),
        user_id = req.user.id;
    console.log( '` like add', id, photo_id, user_id );

    if ( !gallery_id || !photo_id || !user_id )
        return res.send({ error: { arguments: true }});
    cards.get(
        { _id: gallery_id },
        function( err, gal ) {
            var photos = gal.photos || [],
                photo = null;
            // checkings
            if ( err ) return res.send({ error: { database: true }});
            if ( !gal ) return res.send({ error: { not_exists: true }});
            // find photo
            photos.forEach( function( v, index ) {
                if ( v && v.name == photo_id ) photo = v;
            });
            if ( !photo ) return res.send({ error: { no_photo: true }});
            if ( !photo.likers ) photo.likers = [];
            if ( !!~ photo.likers.indexOf( user_id ))
                return res.send({ error: { already_liked: true }});
            // like it
            photo.likers.push( user_id );
            if ( !photo.likes ) photo.likes = 0;
            photo.likes++;
            cards.update(
                { type: gallery, _id: gallery_id },
                gal,
                function( err, updated ) {
                    if ( err || !updated )
                        return res.send({ error: { update: true, database: true }});
                    res.send({ success: { likes: photo.likes }});
                })
        });
};

exports.likeGet = function( err, res ) {
    var gallery_id = ObjectID( req.params.id ),
        photo_id = ObjectID( req.params.photo );
    if ( !gallery_id || !photo_id )
        return res.send({ error: { arguments: true }});
    cards.get(
        { _id: gallery_id },
        function( err, gal ) {
            if ( err || !gal )
                return res.send({ error: { database: true }});
            var photos = gal.photos || [],
                photo = null;
            // find photo
            photos.forEach( function( v, index ) {
                if ( v && v.name == photo_id ) photo = v;
            });
            if ( !photo ) return res.send({ error: { no_photo: true }});
            res.send({ success: { likes: photo.likes }});
        });
};