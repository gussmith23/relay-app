var dblite = require('dblite');
var db = dblite('db.sqlite');
var assert = require('assert');
var updateIndex = require('update-index').updateIndex;
var minTimeBetweenLapsSeconds = require('config').minLapTime; 
var io = null;

module.exports.setIo = function(ioInstance) {
  io = ioInstance;
}

// Adds lap, checking first that the lap is valid - NOTE: this means that a document isn't guaranteed to be inserted!
module.exports.addLap = function(uid) {
  
  db.query("SELECT * FROM fact WHERE uid = ? AND Timestamp > DATETIME('now','-? seconds')", [uid, minTimeBetweenLapsSeconds],  
    function(err, rows) {
      
      /**
       * MAJOR TODO
       * If we hold up a tag to the receiver and spam the thing, eventually we effectively crash the server.
       * It has to do with the fact that this callback is never actually called. 
       * Not currently sure why. Memory issue? Makes me worry about the memory situation in general.
       */
       
      // If there are no records within the past minTimeBetweenLapsSeconds seconds...
      if (rows.length == 0) { // TODO does this actually work?
      
        console.log("Valid lap time!");
        
        db.query(
          'PRAGMA foreign_keys = ON;' +         // Turn on foreign key constraints. Must be done here in the query!
          'INSERT INTO fact (uid) VALUES (?)',
          [uid],
          function(err,data) { // Note: have to put data argument in here to get err object. (with single arg, it's func(data))
             updateIndex();
             /**
              * TODO
              * Ideally, we'd check for INSERT failures due to foreign key constraints. 
              * These failures happen when we log a lap for a non-registered team.
              * An error will come up in the server's output: "Error: near line ?: foreign key constraint failed"
              * However, we'd like to detect this (so we don't waste time updating everything!)
              * The good news is that these records still aren't added in.
              */
          });
      } else {
        console.log("Invalid lap time; less than minTimeBetweenLapsSeconds seconds. Not logging!");
      }
      
    });
}