var server = require( 'piezo-server' ),
	cards = server.libs.cards,
	fs = require('fs'),
	ObjectID = server.utils.ObjectID;

exports.list = function(req, res){
	cards.list(
		{ type: 'unsibscriber' },
		{ limit: 10000 },      // todo: paginator
		function( err, list ) {
			if ( err || !list ) return res.send({ error: { database: true }});
			res.send({ success: list });
		});
};

exports.save = function(req, res){
	cards.create({
		type: 'unsibscriber',
		email: req.body.email,
	},{ exists: false },function( err, doc ) {
		// errors
		if ( err || !doc )
			return res.send({ error: { create: true }});
		// success
		res.json({ success: doc });
	});
};

exports.remove = function(req, res){
	var id = ObjectID( req.params.id );
	cards.remove(
		{ type: 'unsibscriber', _id: id },
		function( err, removed ) {
			if ( err ) return res.send({ error: { database: true }});

			res.send({ success: removed });
		});
};

exports.donwload = function(req, res){
	cards.list(
		{ type: 'unsibscriber' },
		{ limit: 10000 },      // todo: paginator
		function( err, list ) {
			if ( err || !list ) return res.send({ error: { database: true }});
			var path = './uploads/email.txt';
			var file = fs.createWriteStream(path);
			file.on('error', function(err) {
				console.log( 'Not find file' );
			});
			list.forEach(function(v) { 
				var text = v.email + '\r\n'; 
				file.write(text); 
			});
			file.end(function(){
				res.download(path, function(err){
					if( err ) console.log( err );
					res.send(404);
				});
			});	
		});
}