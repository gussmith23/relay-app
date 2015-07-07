var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
//var mongoClient = require('mongodb').MongoClient;
var assert = require('assert');
var socket_io = require('socket.io');
var io = socket_io();
//var lapCounter = require("lap_counter");
var async = require('async');
//var mongoConnector = require('connection');
var dblite = require('dblite');
var db_sql = dblite('models/db.sqlite');
var updateIndex = require('update-index').updateIndex;

// Start mongo connection.
//mongoConnector.createConnection();

// Express
var app = express();

// SQLite initialization.
db_sql.query("PRAGMA foreign_keys = ON");   // Foreign key constraints on.
db_sql.query('CREATE TABLE IF NOT EXISTS teams (uid VARCHAR(10) PRIMARY KEY, name TEXT, color TEXT)');
db_sql.query('CREATE TABLE IF NOT EXISTS fact (id INTEGER PRIMARY KEY, uid TEXT, Timestamp DATETIME DEFAULT CURRENT_TIMESTAMP, FOREIGN KEY(uid) REFERENCES teams(uid))');

// Routes
var routes = require('./routes/index');
//var users = require('./routes/users');
//var labs = require("./routes/labs");
var newUid = require("./routes/new-uid");               // Single file to handle POSTs to new-uid.

// Socket.io
app.io = io;
io.on('connection', function(socket) {
  
  updateIndex();
  
  //console.log('Connection established.');
  // TODO the below code doesn't work - or maybe it does, and the clientside isn't working.
  io.on('request refresh',function(){
    console.log("Refresh requested by page.");
    updateIndex();
  });
});

// Pass io to needed places.
require('fact').setIo(io);
require('fact_sql').setIo(io);
require('update-index').setIo(io);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Routing.
app.use('/', routes);
app.post("/new-uid", newUid(io));


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
