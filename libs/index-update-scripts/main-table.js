var dblite = require('dblite');
var assert = require('assert');
var db = dblite('db.sqlite');

module.exports = function(io) {
  
  var queryStatement = 
    "SELECT teams.name Name, teams.color Color, teams.textcolor TextColor, " +
    // Number of laps
    "COUNT(a.uid) NumLaps, " +
    // End number of laps
    // Min lap time
    "MIN(" +
      "strftime('%s',a.Timestamp)" +
      " - " +
      "strftime('%s'," +
        "(SELECT b.Timestamp FROM fact b WHERE a.uid = b.uid AND b.Timestamp < a.Timestamp ORDER BY b.Timestamp DESC LIMIT 1)" +
      ")" +
    ") MinLapTime " +
    // End Min lap time
    "FROM fact a " + 
    "LEFT JOIN teams " +
    "ON a.uid = teams.uid " +
    "WHERE teams.name IS NOT NULL " +
    "GROUP BY teams.uid " +
    "ORDER BY NumLaps DESC";

  console.log("Updating main table.");
  
  db.query(queryStatement, function(err, rows) {
    //console.log("Main table SQL query returned " + rows.length + " rows.");
    
    io.emit('update main table', rows);
  });
  
}