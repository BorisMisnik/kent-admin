var server = require( 'piezo-server' ),
	ObjectID = server.utils.ObjectID,
	cards = server.libs.cards;
	
exports.thinkList = function(req, res){
	cards.list(
		{ type: 'think' },
		{ limit: 10000 },     
		function( err, list ) {
			if ( err || !list ) return res.send('error', 400);
			res.send({success : list});
		});
};

exports.saveThink = function(req, res){
	// store
	cards.create({
		account_id: req.body.user.account_id,
		type: 'think',
		email: req.body.user.email,
		name: req.body.user.name,
		message: req.body
	},{exists: false},function( err, doc ) {
		// errors
		if ( err || !doc )
			return res.send('error', 400);
		// success
		res.send('ok', 200);
	});
};

exports.get = function(req, res){
	
	var id = ObjectID( req.params.id );
	if ( !id ) return res.send({ error: { id: true }});
	cards.get(
		{ type: 'think', _id: id },
		function( err, feedback ) {
			if ( err ) return res.send({ error: { database: true }});
			if ( !feedback ) return res.send({ error: { not_found: true }});
			res.send({ success: feedback });
		});
};

exports.remove = function(req, res){
	var id = ObjectID( req.params.id );
	cards.remove(
		{ type: 'think', _id: id },
		function( err, removed ) {
			if ( err ) return res.send({ error: { database: true }});

			res.send({ success: removed });
		});
}