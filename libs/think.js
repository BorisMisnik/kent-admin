var server = require( 'piezo-server' ),
	cards = server.libs.cards;
	
exports.thinkList = function(req, res){
	cards.list(
		{ type: 'think' },
		{ limit: 10000 },     
		function( err, list ) {
			if ( err || !list ) return res.send('error', 400);
			res.send({success : list});
		});
}
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
}