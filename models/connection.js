var mongoClient = require('mongodb').MongoClient;

module.exports.db = null;

// Mongo connection.
module.exports.createConnection = function() {
  mongoClient.connect("mongodb://127.0.0.1:27017/relay", function(err, database) {
    if(err) throw err;
    module.exports.db = database;
    console.log("Database connection established.");
  });
}


