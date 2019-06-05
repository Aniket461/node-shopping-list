const path = require('path');//module to join path to the public folder
const express = require('express'); // express module which will help develop server easily
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var expressValidator = require('express-validator');
var User = require('./models/users');
var session = require('express-session');


const publicPath = path.join(__dirname, '/public'); // joined the path to public folder
var app = express(); // server created
const port = process.env.PORT || 3000; // where we want to access our server
var flash = require('connect-flash');
app.use(flash());

app.use(express.static(publicPath));
app.set('view engine', 'ejs');


//database connection
var mongoUrl = 'mongodb://localhost:27017/test'

mongoose.connect(mongoUrl, {useNewUrlParser: true});

var db= mongoose.connection;
db.on('error', console.error.bind(console, 'connection error'));
db.once('open', function(){

console.log('connected to mongo DB');

});



// body parser middleware

app.use(bodyParser.urlencoded({extended: false}));
//parse application/json
app.use(bodyParser.json());

//express session middleware
app.use(session({
  secret: 'keyboard cat',
  resave: true,
  saveUninitialized: true,
  //cookie: { secure: true }
}));



//express-validator middleware

app.use(expressValidator({

errorFormatter: function(param,msg,value){

	var namespace= param.split('.')
	, root = namespace.shift()
	, formParam = root;

	while(namespace.length){
		formParam += '[' + namespace.shift() + ']';
	}
	return{

		param: formParam,
		msg: msg,
		value

	};
}
}));




var user = ['test','neck', 'blow'];


app.get('/', function(req,res){

res.render('index',{


title: "first",

user: user

});


});


app.get('/second', function(req,res){


res.render('second', {

title: "hello"

});

});


app.locals.errors = null;

app.post('/', function(req,res){

var name = req.body.name;

var username = req.body.username;

var email = req.body.email;

var password = req.body.password;


req.checkBody('name', 'Name is required!').notEmpty();
req.checkBody('username', 'Username is required!').notEmpty();
req.checkBody('email', 'Email is required!').notEmpty();

var errors = req.validationErrors();

if(errors){

  	res.render('index', {

  		errors: errors,
		 title: 'Home'

	});

  }
  else{


  	User.findOne({username: username}, function(err, user){


if(err) console.log(err);

  		if(user){

  			res.redirect('/second');
  		}

  		else{

  				var user = new User({

  					name: name,
  					email: email,
  					username: username,
  					password: password,



  				});


  						user.save(function(err){

  							if(err) console.log(err);

  							else{


  								res.redirect('/login');
  							}

  						});

}



  	});

}

})


app.get('/login',function(req,res){


res.render('login',{

title: "login",
errors: null



});


});

app.post('/login', function(req,res)
{

	var username = req.body.username;
	var password = req.body.password;

	req.checkBody('username', 'Username is required!!').notEmpty();
	req.checkBody('password', 'Password is required!!').notEmpty();


User.findOne({username: username}, function(err,user){

if(user){

if(user.password == password){



console.log('logged in successfully');
res.redirect('/');

}
else{

console.log("Invalid Username password combination");
res.render('login',{

error: null,
title: "login"

});


}

}

else{

console.log("No such username");

}


});



});



// telling server to listen on above given port
app.listen(port, function(){

	console.log("Server is up on port: " +port);
});
