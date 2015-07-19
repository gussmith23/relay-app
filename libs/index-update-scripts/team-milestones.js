var dblite = require('dblite');
var assert = require('assert');
var db = dblite('db.sqlite');

module.exports = function(io, uid) {
  
  console.log("Updating team milestones."); 
  
  var query = "SELECT * FROM teamLapMilestones milestones" +
                "LEFT JOIN teams " +
                "ON teams.uid = ? " +
                "AND numLaps = " + 
                  "(SELECT COUNT(*) FROM fact WHERE uid = ?)";
                  
  db.query(query, [uid, uid], function(rows) {
    if (rows.length > 0) {
      console.log("New team milestone reached!");
      console.log(rows);
      
      io.emit('update team milestone', {
        milestoneName: rows[0][1],
        teamName: rows[0][3],
        teamColor: rows[0][4],
        textColor: rows[0][5]
      });
      
    }
  });
  
}