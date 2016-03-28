'use strict';

module.exports = {
  submitWorkout: function(dbConn, workout, callback) {
    var query = dbConn.query('INSERT INTO workouts SET ?', workout, callback);
    if (process.env.NODE_ENV === 'development') {
      console.log(query.sql);
    }
  },

  getWorkouts: function(dbConn, userId, callback) {
    var queryString = 'SELECT id, squats, bench_press, barbell_rows, ' +
      'overhead_press, deadlifts, date ' +
      'FROM workouts ' +
      'WHERE user_id = ?';
    var query = dbConn.query(queryString, userId, callback);
    if (process.env.NODE_ENV === 'development') {
      console.log(query.sql);
    }
  },

  updateWorkout: function(dbConn, workout, workoutDate, userId, callback) {
    var queryString = 'UPDATE workouts SET ? WHERE date = ? AND user_id = ?';
    var query = dbConn.query(queryString, [workout, workoutDate, userId], callback);
    if (process.env.NODE_ENV === 'development') {
      console.log(query.sql);
    }
  },

  deleteWorkout: function(dbConn, workoutDate, userId, callback) {
    var queryString = 'DELETE FROM workouts WHERE date = ? AND user_id = ?';
    var query = dbConn.query(queryString, [workoutDate, userId], callback);
    if (process.env.NODE_ENV === 'development') {
      console.log(query.sql);
    }
  }
};
