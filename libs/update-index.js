var update_rankingByLap = require('index-update-scripts/ranking-by-lap');
var io = null;

// Inject io object.
module.exports.setIo = function(ioObject) {
  io = ioObject;
}

// Run updates, passing socket.io object into each one.
module.exports.updateIndex = function() {
  
  console.log('Running updates.');
  
  update_rankingByLap(io);
  
}