var assert = require('assert');

exports.update = function(db, io) {
    
  // The Google Charts data.
  var data = [];

  db.collection('teams').distinct("uid", function(err,docs) {
    
    // The total number of teams we'll iterate through.
    var totalNumberOfTeams = docs.length;

    // 
    docs.forEach(function(currentVal) {
    
      db.collection('fact').find({uid: currentVal}).toArray(function(err, docs) {
      
        teamAndLapCount = [currentVal, docs.length];

        data.push(teamAndLapCount);

        // If we've collected data for all teams...TODO there's gotta be a 
        // smarter way to do this; i'm just new to async programming.
        if (data.length == totalNumberOfTeams) io.emit('update lap count',data);

      });

    });

  });
  
}

module.exports = exports;
