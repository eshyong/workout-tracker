'use strict';

module.exports = {
  submitWorkout: function(dbConn, workout, callback) {
    dbConn.query('INSERT INTO workouts SET ?', workout, callback);
  },

  getWorkouts: function(dbConn, callback) {
    dbConn.query('SELECT id, squats, bench_press, barbell_rows, ' +
      'overhead_press, deadlifts, date FROM workouts', callback);
  },

  updateWorkout: function(dbConn, workout, callback) {
    var workoutDate = workout.date,
      queryString = 'UPDATE workouts SET ? WHERE date = ?';
    dbConn.query(queryString, [workout, workoutDate], callback);
  },

  deleteWorkout: function(dbConn, workout, callback) {
    var workoutDate = workout.date,
      queryString = 'DELETE FROM workouts WHERE date = ?';
    dbConn.query(queryString, workoutDate, callback);
  }
};
