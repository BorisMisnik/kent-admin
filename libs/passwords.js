var server = require( 'piezo-server' )
  , auth = server.libs.auth
  , cards = server.libs.cards
  , crypto = require('crypto')
  , fs = require('fs');

exports.index = function (req, res) {
	// 
};
exports.cratePasswords = function(req, res){
	var i = 2000;
	var n = 0;
	// crate email
	while(i){
		crypto.randomBytes(3, function(ex, buf) {
			var token = buf.toString('hex');
			createPromo(token, 'ahead');
		});
		i--;
	};
	res.send('success');
};

exports.download = function(req, res){
	// get all acounts
	var passwords = [];

	var options = {
		limit:0,
		skip: 300
	};
	auth.users({login:'ahead'},options, function(err, result){
		result.forEach(function(obj){
			var str = 'login:' + obj.login + ' password:' + obj.password + ';';
			passwords.push(str);
		});
		res.send(passwords)
		// printTxt();
	});
	
	function printTxt(){
		var path = './uploads/passwords.txt';
		var file = fs.createWriteStream(path);
		file.on('error', function(err) {
			console.log( 'Not find file' );
		});
		passwords.forEach(function(v) { file.write(v) + '\r\n'; });
		file.end(function(){
			res.download(path, function(err){
				if( err ){
					console.log( err );
					res.send(404);
				}
			})
		});	
	};
}

function createPromo(password, login){
	auth.create({
		active: false,
		role: 'visitor',
		login: login,
		password: password // todo md5
	}, function() {}, false); // promo flag (!)
}