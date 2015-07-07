var express = require('express');
var router = express.Router();
var app = require('../app');
var io = app.io;
var db = app.db;
var factModel = require('fact_sql');

/* POST new-uid */
module.exports = function(io) {
  
  return function(req, res, next) {
  
  console.log('Received JSON:\n%j', req.body);
 
  factModel.addLap(req.body.uid);
  
  // Emit.
  io.emit('new fact', req.body);

  // End.
  res.send({});

  }
}

