var update_rankingByLap = require('index-update-scripts/ranking-by-lap');
var update_minimumLapTime = require('index-update-scripts/minimum-lap-time');
var update_mainTable = require('index-update-scripts/main-table');
var io = null;

// Inject io object.
module.exports.setIo = function(ioObject) {
  io = ioObject;
}

// Run updates, passing socket.io object into each one.
module.exports.updateIndex = function() {
  
  console.log('Running updates.');
  
  //update_rankingByLap(io);
  //update_minimumLapTime(io);
  update_mainTable(io);
  
}