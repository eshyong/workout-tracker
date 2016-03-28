'use strict';

var mysql = require('mysql');

// Database setup for local development only
if (process.env.NODE_ENV === 'development') {
  var connection = mysql.createConnection({
    host: 'localhost',
    user: 'workout_tracker',
    password: process.env.DEV_WORKOUT_TRACKER_PW,
    database: 'workouts'
  });
}

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
  },
  showWarnings: function(dbConn, callback) {
    dbConn.query('SHOW WARNINGS', callback);
  }
};
