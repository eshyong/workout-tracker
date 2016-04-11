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
} else if (process.env.NODE_ENV === 'production') {
  var connection = mysql.createConnection({
    host: process.env.AWS_MYSQL_INSTANCE_HOSTNAME,
    user: 'workout_tracker',
    password: process.env.MYSQL_WORKOUT_TRACKER_PW,
    database: 'workouts'
  });
} else {
  throw new Error(`Unknown NODE_ENV: ${process.env.NODE_ENV}`);
}

module.exports = {
  connect: function() {
    connection.connect(function(err) {
      if (err) {
        console.error('Error connecting to db');
        console.error(`Code: ${err.code}, message: ${err.message}`);
        return null;
      }
      console.log('Connected to mysql with ID ' + connection.threadId);

      // Make sure we get MySQL strict mode
      connection.query('SET SESSION sql_mode = "STRICT_ALL_TABLES"', function(err) {
        if (err) {
          console.error('Error setting strict mode');
          console.error(`Code: ${err.code}, message: ${err.message}`);
          return null;
        }

        // Handle cases when MySQL server is down
        connection.on('error', function(err) {
          if (err) {
            console.error('Error with MySQL server');
            console.error(`Code: ${err.code}, message: ${err.message}`);
          }
        });
        return connection;
      });
    });
  },
  showWarnings: function(dbConn, callback) {
    dbConn.query('SHOW WARNINGS', callback);
  }
};
