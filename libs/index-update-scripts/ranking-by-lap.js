//var mongoFactory = require('mongo-factory');
var dblite = require('dblite');
var assert = require('assert');

module.exports = function(io) {
  
  var db = dblite('db.sqlite'); // This may be a bad idea...i'm putting these here to test why holding
                                // tag to receiver crashes the system.
  
  console.log("Updating lap rankings.");
  
  db.query(
    "SELECT teams.name, teams.color, teams.textcolor, COUNT(fact.uid) " +
    "FROM fact " +
    "LEFT JOIN teams " +
    "ON fact.uid = teams.uid " +
    "WHERE teams.name IS NOT NULL " +
    "GROUP BY fact.uid " +
    "ORDER BY COUNT(fact.uid) DESC " +
    "LIMIT 10",                       // Get the top 10
    function(err, rows) {
      
      assert.equal(err, null);
      
      console.log("Current rankings by number of laps:");
      console.log(rows);
      
      // Emit.
      io.emit('update ranking by lap', rows);
    }
   );
  
}