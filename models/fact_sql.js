var dblite = require('dblite');
var db = dblite('db.sqlite');
var assert = require('assert');
var updateIndex = require('update-index').updateIndex;
var minTimeBetweenLapsSeconds = 50; 
var io = null;

module.exports.setIo = function(ioInstance) {
  io = ioInstance;
}

// Adds lap, checking first that the lap is valid - NOTE: this means that a document isn't guaranteed to be inserted!
module.exports.addLap = function(uid) {
  db.query("SELECT * FROM fact WHERE uid = ? AND Timestamp > DATETIME('now','-? seconds')", [uid, minTimeBetweenLapsSeconds],  
    function(err, rows) {
      
      //assert.equal(null,err);
      
      //console.log("Records more recent than " + minTimeBetweenLapsSeconds + " seconds:");
      //console.log(rows);
      
      // If there are no records within the past minTimeBetweenLapsSeconds seconds...
      if (rows == null || rows.length <= 0) { // TODO does this actually work?
      
        //console.log("Valid lap time!");
        
        db.query(
          'PRAGMA foreign_keys = ON;' +
          'INSERT INTO fact (uid) VALUES (?)',
          [uid],
          function(err,data) { // Note: have to put data argument in here to get err object. (with single arg, it's func(data))
            
            // Debug.
            console.log(err);
            console.log(data);
          
            if (err == null) {
              console.log('Inserted new lap for uid ' + uid);
              
              // Call updates.
              updateIndex();
            } else {
              console.log("Error adding new lap for uid " + uid + ". (Usually, this means that the tag isn't registered to a team!)");
            }
            
          });
      } else {
        console.log("Invalid lap time; less than minTimeBetweenLapsSeconds seconds. Not logging!");
      }
      
    });
}