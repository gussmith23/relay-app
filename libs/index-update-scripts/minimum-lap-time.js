var dblite = require('dblite');
var assert = require('assert');

module.exports = function(io) {
 
  
  var db = dblite('db.sqlite'); // This may be a bad idea...i'm putting these here to test why holding
                                // tag to receiver crashes the system.
  
  console.log("Updating minimum lap time rankings.");
  
  /*
  SELECT id, a.Timestamp, (SELECT b.Timestamp FROM fact b WHERE b.Timestamp < a.Timestamp ORDER BY b.Timestamp DESC LIMIT 1),strftime('%s',a.Timestamp)-strftime('%s',(SELECT b.Timestamp FROM fact b WHERE b.Timestamp < a.Timestamp ORDER BY b.Timestamp DESC LIMIT 1))  FROM fact a WHERE uid='0000000000';
  */
  
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
    console.log("Current rankings by minimum lap time:");
    console.log(rows);
    
    io.emit('update ranking by minimum lap time', rows);
  });
    
    
}