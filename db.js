'use strict';

var mysql = require('mysql');

// Database setup for local development only
// TODO: Deploy app to the **cloud**
var connection = mysql.createConnection({
  host: 'localhost',
  user: 'workout_tracker',
  password: 'abc123',
  database: 'workouts'
});

module.exports = {
  connect: function() {
    connection.connect(function(err) {
      if (err) {
        console.log('Error connecting to db: ' + err.stack);
        throw err;
      }
      console.log('Connected with ID ' + connection.threadId);
    });
    return connection;
  }
};
