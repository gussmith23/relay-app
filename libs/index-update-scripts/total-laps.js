var dblite = require('dblite');
var assert = require('assert');

var db = dblite('db.sqlite'); 

module.exports = function(io) {
  
  console.log("Updating total lap count.");
  
  db.query(
    "SELECT COUNT(*) FROM fact",
    function(err, rows) {
      
      assert.equal(err, null);
      
      // Emit.
      // Structure of rows is [ [ <total lap count> ] ]
      io.emit('update total laps', rows[0][0]);
    }
   );
  
}
