'use strict';

let mysql = require('mysql');

// Database setup for local development only
// TODO: Deploy app to the **cloud**
let connection = mysql.createConnection({
  host: 'localhost',
  user: 'workout_tracker',
  password: 'abc123',
  database: 'workouts'
});

connection.connect((err) => {
  if (err) {
    console.log('Error connecting to db: ' + err.stack);
    throw err;
  }
  console.log('Connected with ID ' + connection.threadId);
});

module.exports = {
  conn: connection,
};