var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var index = require('./routes/index');
var users = require('./routes/users');
var videos = require('./routes/videos');
var setup = require('./routes/setup');
var orders = require('./routes/orders');
var mailsender = require('./routes/mailSender')
var app = express();


var morgan = require('morgan');
var mongoose = require('mongoose'); 
var jwt = require('jsonwebtoken');
var config = require('./config');
var User = require('./app/models/user.js');

mongoose.connect(config.database);

app.set('port', (process.env.PORT || 5000));


app.set('superSecret',config.secret);


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(morgan('dev'));




var router = express.Router();


//Middleware to verify the token
router.use(function(req,res){
	var token = req.body.token || req.query.token || req.headers['x-access-token'];

	if(token)
	{
		jwt.verify(token,app.get('superSecret'),function(err,decode)
		{
			if(err)
			{
				return res.json({sucess:false,message:"Failed to authenticate the token"});
			}
			else
			{
				req.decode = decode;
				next();
			}
		})
	}
	else
	{
		return res.json({
			sucess:false,
			message:'No token provided'
		});
	}


});





app.use('/', index);
app.use('/users', users);
app.use('/api/videos',videos);
app.use('/setup', setup);
app.use('/orders',orders);
app.use('/mailsender',mailsender);

//console.log('After use of usersetup');
/*Basic routes
app.get('/setup',function(req,res){
	var bhags = new User({
		name:'Bhagyashri Bhangale',
		password:'bhagibhagi',
		admin:true
	});



	bhags.save(function(err){
		if(err) throw err;

		console.log("User saved successfully");
		res.json({sucess:true});
	});

});
*/


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

//For avoidong Heroku $PORT error
app.get('/', function(request, response) {
    var result = 'App is running'
    response.send(result);
}).listen(app.get('port'), function() {
    console.log('App is running, server is listening on port ', app.get('port'));
});



module.exports = app;
