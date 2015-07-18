var dblite = require('dblite');
var assert = require('assert');
var db = dblite('db.sqlite');

var milesPerLap = 0.248548;

module.exports = function(io) {
  
  console.log("Updating latest landmark.");
  
  var queryStatement = "SELECT *, (" + milesPerLap + " * (SELECT COUNT(*) FROM fact)) - distance distancePast FROM landmarks " +
    "WHERE  distancePast > 0 " +
    "ORDER BY distancePast ASC " +
    "LIMIT 1";
    
  db.query(queryStatement, function(rows) {
    io.emit('update latest landmark', rows[0]);
  });
  
  
  
  
}