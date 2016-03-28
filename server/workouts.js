'use strict';

module.exports = {
  submitWorkout: function(dbConn, workout, callback) {
    dbConn.query('INSERT INTO workouts SET ?', workout, callback);
  },

  getWorkouts: function(dbConn, userId, callback) {
    var queryString = 'SELECT id, squats, bench_press, barbell_rows, ' +
      'overhead_press, deadlifts, date ' +
      'FROM workouts ' +
      'WHERE user_id = ?';
    dbConn.query(queryString, userId, callback);
  },

  updateWorkout: function(dbConn, workout, workoutDate, userId, callback) {
    var queryString = 'UPDATE workouts SET ? WHERE date = ? AND user_id = ?';
    var query = dbConn.query(queryString, [workout, workoutDate, userId], callback);
    console.log(query.sql);
  },

  deleteWorkout: function(dbConn, workoutDate, userId, callback) {
    var queryString = 'DELETE FROM workouts WHERE date = ? AND user_id = ?';
    dbConn.query(queryString, [workoutDate, userId], callback);
  }
};
