var dblite = require('dblite');
var assert = require('assert');
var db = dblite('db.sqlite');

var milesPerLap = 0.248548;

module.exports = function(io) {
  
  console.log("Updating next landmark.");
  
  var queryStatement = "SELECT *, distance - (" + milesPerLap + " * (SELECT COUNT(*) FROM fact)) distanceLeft FROM landmarks " +
    "WHERE  distanceLeft > 0 " +
    "ORDER BY distanceLeft ASC " +
    "LIMIT 1";
    
  db.query(queryStatement, function(rows) {
    io.emit('update next landmark', rows[0]);
  });
  
  
}