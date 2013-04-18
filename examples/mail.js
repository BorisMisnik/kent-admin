var nodemailer = require( 'nodemailer' );
var transport = nodemailer.createTransport( "SMTP", {
    service: "Mailgun",
    auth: {
        user: "postmaster@kent.com.ua",
        pass: "8b969bz3g407"
    }
});

var mailOptions = {
    from: "Kent <postmaster@kent.com.ua>",
    to: "Test User <me.the.ascii@gmail.com>",
    subject: "Зміна пароля на сайті www.kent.com.ua",
    text: "КУРІННЯ МОЖЕ ВИКЛИКАТИ ЗАХВОРЮВАННЯ НА РАК! Новий пароль: test"
};

transport.sendMail( mailOptions,
    function( err, res ){
        if ( !err ) {
            console.log( res.message ); // response from the server
            console.log( res.messageId ); // Message-ID value used
        }
    });