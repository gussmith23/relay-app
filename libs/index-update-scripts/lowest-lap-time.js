var dblite = require('dblite');
var assert = require('assert'); 
var db = dblite('db.sqlite');
  

module.exports = function(io) {

  console.log("Updating lowest lap time.");
  
  var queryStatement = 
    "SELECT teams.name Name, teams.color Color, teams.textcolor TextColor, " +
    "MIN(" +
      "strftime('%s',a.Timestamp)" +
      " - " +
      "strftime('%s'," +
        "(SELECT b.Timestamp FROM fact b WHERE a.uid = b.uid AND b.Timestamp < a.Timestamp ORDER BY b.Timestamp DESC LIMIT 1)" +
      ")" +
    ") MinLapTime " +
    "FROM fact a " + 
    "LEFT JOIN teams " +
    "ON a.uid = teams.uid " +
    "WHERE teams.name IS NOT NULL " +
    "GROUP BY teams.uid " +
    "ORDER BY MinLapTime ASC";
    
  db.query(queryStatement, function(err, rows) {    
    io.emit('update lowest lap time', rows);
  });
    
    
}