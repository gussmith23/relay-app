var mongoFactory = require('mongo-factory');
var assert = require('assert');
var updateIndex = require('update-index');
var minTimeBetweenLapsMillis = 0 * 60 * 1000; 
var io;

// Sets io var. Need to run this first. TODO seems like a dumb way to do this, but StackOverflow doesn't have anything better. 
module.exports.setIo = function(ioInstance) {
  io = ioInstance;
}

// Adds lap, checking first that the lap is valid - NOTE: this means that a document isn't guaranteed to be inserted!
module.exports.addLap = function(uid) {

  mongoFactory.getConnection('mongodb://localhost:27017').then(function(db) {

    // Find latest record from the same uid.
    db.collection('fact').find({'uid':uid}).sort({_id:-1}).limit(1).toArray(function(err, docs){

      var now = new Date();
      var data = { 'uid' : uid,
                    'timestamp' : now};

      // If it's not the first record, we need to check that it's valid.
      if (docs.length > 0) {
        
        //console.log("Previous entries exist. List:");
        //console.log(docs);

        // Timestamp of the latest record.
        var dateToCompareTo = docs[0].timestamp;
        
        console.log("Latest record:");
        console.log(dateToCompareTo);
        console.log("Latest record plus minTimeBetweenLaps:");
        console.log(new Date(Number(dateToCompareTo) + minTimeBetweenLapsMillis));
        console.log("Now:");
        console.log(now);

        // If the lap is too soon...
        if (Number(dateToCompareTo) + minTimeBetweenLapsMillis > Number(now)) {
          
          console.log("Not enough time between laps! Not logging!");

          // Terminate w/o adding lap to DB.
          return;

        }

      }

      // If it's either the first record, or enough time has passed, then log.
      db.collection('fact').insert(data,function(err, result){
        
        assert.equal(err,null);
        
        console.log("Added document:");
        console.log(data); 
        
        // Emit.
        io.emit('new fact', data);
        
        // Call updates.
        updateIndex(io);
        
      });

      
     
      
    });

  });

}
