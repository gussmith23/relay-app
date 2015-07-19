var update_rankingByLap = require('index-update-scripts/ranking-by-lap');
var update_lowestLapTime = require('index-update-scripts/lowest-lap-time');
var update_lowestAvgLapTime = require('index-update-scripts/lowest-average-lap-time');
var update_mainTable = require('index-update-scripts/main-table');
var update_totalLaps = require('index-update-scripts/total-laps');
var update_latestLandmark = require('index-update-scripts/latest-landmark');
var update_nextLandmark = require('index-update-scripts/next-landmark');


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
  update_totalLaps(io);
  update_latestLandmark(io);
  update_nextLandmark(io);
  update_lowestLapTime(io);
  update_lowestAvgLapTime(io);
}