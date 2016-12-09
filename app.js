var Redis = require('ioredis');
var mongoose = require('mongoose');

var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');


var app = express();

// connect to mongodb
mongoose.connect('mongodb://primary:27017/test,mongodb://secondary1:27017/test,mongodb://secondary2:27017/test');

// load a simple model
mongoose.model('Test', { name: String });

// connect to redis
// app.redis = new Redis({
// 	host: 'pub-redis-18562.us-east-1-4.3.ec2.garantiadata.com',
// 	port: '18562',
// 	db: 0
// });

// load the conroller
var index = require('./controller/index');
var ping = require('./controller/ping');
var slow_res = require('./controller/slow_res');
var redis = require('./controller/redis');
var mongodb = require('./controller/mongodb');
var mix = require('./controller/mix');


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.urlencoded({limit: '25mb', extended: true}));

// parse application/json
app.use(bodyParser.json({limit: '25mb'}));

// parse text https://github.com/expressjs/body-parser#bodyparsertextoptions
app.use(bodyParser.text({limit: '25mb'}));

app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.use('/ping', ping);
app.use('/slow-res', slow_res);
// app.use('/redis', redis);
app.use('/mongodb', mongodb);
app.use('/mix', mix);

// catch 404 and forward to error handler
app.use(function (req, res) {
	res.status(404);
	res.render('error', {
		message: 'Not Found'
	});
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
	app.use(function (err, req, res, next) {
		console.log(err.stack);
		res.status(500);
		res.render('error', {
			message: '500 Error'
		});
	});
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
	console.log(err.stack);
	res.status(500);
	res.render('error', {
		message: '500 Error'
	});
});


module.exports = app;
