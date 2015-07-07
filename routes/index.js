var express = require('express');
var router = express.Router();
var dblite = require('dblite');
var db = dblite('db.sqlite');
var assert = require('assert');
var updateIndex = require('update-index').updateIndex;

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});


/* GET admin page. */
router.get('/admin', function(req, res) {
  
  res.render('admin',{title: 'Admin Page'});
  
});

/* POST new-team */
router.post('/new-team', function(req, res, next) {
  
  console.log("Received new team: ");
  console.log(req.body);
  
  // TODO check for undefined.
  
  db.query(
    "INSERT INTO teams (uid, name, color, textcolor)" +
    "VALUES (?, ?, ?, ?)",
    [req.body.uid, req.body.teamname, req.body.color, req.body.textcolor],
    function(err) {
      //assert.equal(null, err);
      console.log("Inserted team successfully.");
    }
  );
  
  res.render('admin',{title: 'Admin Page'});

});

module.exports = router;
