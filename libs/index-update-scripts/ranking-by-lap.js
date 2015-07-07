//var mongoFactory = require('mongo-factory');
var dblite = require('dblite');
var db = dblite('db.sqlite');
var assert = require('assert');

module.exports = function(io) {
  
  console.log("Updating lap rankings.");
  
  db.query(
    "SELECT teams.name, teams.color, teams.textcolor, COUNT(fact.uid) " +
    "FROM fact " +
    "LEFT JOIN teams " +
    "ON fact.uid = teams.uid " +
    "GROUP BY fact.uid " +
    "ORDER BY COUNT(fact.uid) DESC " +
    "LIMIT 10",                       // Get the top 10
    function(err, rows) {
      
      assert.equal(err, null);
      
      console.log("Current rankings:");
      console.log(rows);
      
      // Emit.
      io.emit('update ranking by lap', rows);
    }
   );
  
}