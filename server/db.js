'use strict';

var mysql = require('mysql');

// Database setup for local development only
if (process.env.NODE_ENV === 'development') {
  var connection = mysql.createConnection({
    host: 'localhost',
    user: 'workout_tracker',
    password: process.env.MYSQL_WORKOUT_TRACKER_PW,
    database: 'workouts'
  });
}

module.exports = {
  connect: function() {
    connection.connect(function(err) {
      if (err) {
        console.log('Error connecting to db');
        throw err;
      }
      console.log('Connected to mysql with ID ' + connection.threadId);
    });
    // Make sure we get MySQL strict mode
    connection.query('SET SESSION sql_mode = "STRICT_ALL_TABLES"', function(err) {
      if (err) {
        console.log('Error setting strict mode');
        throw err;
      }
    });
    return connection;
  },
  showWarnings: function(dbConn, callback) {
    dbConn.query('SHOW WARNINGS', callback);
  }
};
