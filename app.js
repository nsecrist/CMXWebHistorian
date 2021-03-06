var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var fs = require('fs');
var db = require('./src/db.js');
var dash = require('appmetrics-dash').monitor();
var pid = require('./src/pid_lookup.js');

// Routes
var index = require('./routes/index');
var users = require('./routes/users');
var notification = require('./routes/notification');
var realTime = require ('./routes/real_time');
var test = require ('./routes/test');
var apiV1 = require ('./routes/api/v1');
var apiDoc = require ('./routes/apidoc.js');

var app = express();

var accessLogStream = fs.createWriteStream(path.join(__dirname, 'access.log'), {flags:'a'});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('combined', {stream: accessLogStream}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.use('/users', users);
app.use('/notification', notification);
app.use('/realtime', realTime);
app.use('/test', test);
app.use('/tads/api/v1', apiV1);
app.use('/api-docs', apiDoc);

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

module.exports = app;
