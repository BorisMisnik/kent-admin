var server = require( 'piezo-server' )
  , auth = server.libs.auth
  , cards = server.libs.cards
  , crypto = require('crypto')
  , fs = require('fs');

exports.index = function (req, res) {
	// 
};
exports.cratePasswords = function(req, res){
	var i = 2;
	var n = 0;
	// crate email
	while(i){
		crypto.randomBytes(3, function(ex, buf) {
			var token = buf.toString('hex');
			cretaSms(token);
		});
		i--;
	};

	// var i = 10000;
	// while(i){
	// 	crypto.randomBytes(3, function(ex, buf) {
	// 		var token = buf.toString('hex');
	// 		cretaEmail(token);
	// 	});
	// 	i--;
	// }

	// var i = 10000;
	// while(i){
	// 	crypto.randomBytes(3, function(ex, buf) {
	// 		var token = buf.toString('hex');
	// 		cretaEmail(token);
	// 	});
	// 	i--;
	// }

	// var i = 10000;
	// while(i){
	// 	crypto.randomBytes(3, function(ex, buf) {
	// 		var token = buf.toString('hex');
	// 		cretaEmail(token);
	// 	});
	// 	i--;
	// }

	// var i = 10000;
	// while(i){
	// 	crypto.randomBytes(3, function(ex, buf) {
	// 		var token = buf.toString('hex');
	// 		cretaEmail(token);
	// 	});
	// 	i--;
	// }

	// var i = 16147;
	// while(i){
	// 	crypto.randomBytes(3, function(ex, buf) {
	// 		var token = buf.toString('hex');
	// 		cretaEmail(token);
	// 	});
	// 	i--;
	// }
	// // crate sms
	// var i = 10000;
	// while(i){
	// 	crypto.randomBytes(3, function(ex, buf) {
	// 		var token = buf.toString('hex');
	// 		cretaSms(token);
	// 	});
	// 	i--;
	// }

	// var i = 10000;
	// while(i){
	// 	crypto.randomBytes(3, function(ex, buf) {
	// 		var token = buf.toString('hex');
	// 		cretaSms(token);
	// 	});
	// 	i--;
	// }

	// var i = 9034;
	// while(i){
	// 	crypto.randomBytes(3, function(ex, buf) {
	// 		var token = buf.toString('hex');
	// 		cretaSms(token);
	// 	});
	// 	i--;
	// }
	res.send('success');
};

exports.download = function(req, res){
	// get all acounts
	var passwords = [];
	var miss = 0;
	var skip = 0;

	getPasswords(20000);
	function getPasswords (miss){
		var options = {
			limit:miss,
			skip:skip
		};
		auth.users({login:'email'},options, function(err, result){
			result.forEach(function(obj){
				var str = 'login:' + obj.login + ' password:' + obj.password + ';\r\n';
				passwords.push(str);
			});
			var limit = options.limit;

			limit = limit + 20000 == 40000 ? limit += 26137 : limit += 20000;
			if( limit <= 46137 ){
				skip = limit === 66137 ? skip + 26137  : skip + 20000;
				getPasswords(limit);
			} else {
				skip = 0;
				getSmsPasswords(29024);
			}	
		});
	};
	function getSmsPasswords (miss) {
		var options = {
			limit:miss,
			skip:skip
		};
		auth.users({login:'sms'},options, function(err, result){
			result.forEach(function(obj){
				var str = 'login:' + obj.login + ' password:' + obj.password + ';\r\n';
				passwords.push(str);
			});
			printTxt(0);
		});
	};

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

function cretaSms(password){
	// crate sms acounts
	auth.create({
		active: false,
		role: 'visitor',
		login: 'sms',
		password: password // todo md5
	}, function(err, rusult) {}, false); // promo flag (!)
};

function cretaEmail(password){
	// crate sms acounts
	auth.create({
		active: false,
		role: 'visitor',
		login: 'email',
		password: password // todo md5
	}, function() {}, false); // promo flag (!)
};
