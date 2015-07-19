var dblite = require('dblite');
var assert = require('assert');
var db = dblite('db.sqlite');

module.exports = function(io) {
  
  console.log("Updating lowest average lap time.");
  
  var queryStatement = 
  "SELECT teams.name Name, teams.color Color, teams.textcolor TextColor, " +
    // Min lap time
    "AVG(" +
      "strftime('%s',a.Timestamp)" +
      " - " +
      "strftime('%s'," +
        "(SELECT b.Timestamp FROM fact b WHERE a.uid = b.uid AND b.Timestamp < a.Timestamp ORDER BY b.Timestamp DESC LIMIT 1)" +
      ")" +
    ") AvgLapTime " +
    // End Min lap time
    "FROM fact a " + 
    "LEFT JOIN teams " +
    "ON a.uid = teams.uid " +
    "WHERE teams.name IS NOT NULL " +
    "GROUP BY teams.uid " +
    "ORDER BY AvgLapTime ASC " +
    "LIMIT 100";
    
    db.query(queryStatement, function(rows) {
      io.emit('update lowest average lap time', rows);
    });
    
}