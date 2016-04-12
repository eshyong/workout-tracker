'use strict';

function logSqlIfVerbose(query) {
  var nodeEnv = process.env.NODE_ENV;
  var logSql = process.env.LOG_SQL;
  if (nodeEnv === 'development' && logSql === 'true') {
    console.log(query.sql);
  }
}

module.exports = {
  submitWorkout: function(dbConnPool, workout, callback) {
    var query = dbConnPool.query('INSERT INTO workouts SET ?', workout, callback);
    logSqlIfVerbose(query);
  },

  getWorkouts: function(dbConnPool, userId, callback) {
    var queryString = 'SELECT id, squats, bench_press, barbell_rows, ' +
      'overhead_press, deadlifts, date, is_type_a ' +
      'FROM workouts ' +
      'WHERE user_id = ? ' +
      'ORDER BY date';
    var query = dbConnPool.query(queryString, userId, callback);
    logSqlIfVerbose(query);
  },

  getWorkoutByDate: function(dbConnPool, userId, date, callback) {
    var queryString = 'SELECT id, squats, bench_press, barbell_rows, ' +
      'overhead_press, deadlifts, date, is_type_a ' +
      'FROM workouts ' +
      'WHERE user_id = ? AND date = ?' +
      'ORDER BY date';
    var query = dbConnPool.query(queryString, [userId, date], callback);
    logSqlIfVerbose(query);
  },

  getWorkoutAverages: function(dbConnPool, userId, callback) {
    var queryString = 'SELECT AVG(squats) AS squats, ' +
      'AVG(bench_press) AS bench_press, ' +
      'AVG(barbell_rows) AS barbell_rows,' +
      'AVG(overhead_press) AS overhead_press, ' +
      'AVG(deadlifts) AS deadlifts ' +
      'FROM workouts ' +
      'WHERE user_id = ?';
    var query = dbConnPool.query(queryString, userId, callback);
    logSqlIfVerbose(query);
  },

  getWorkoutMaxes: function(dbConnPool, userId, callback) {
    var queryString = 'SELECT MAX(squats) AS squats, ' +
      'MAX(bench_press) AS bench_press, ' +
      'MAX(barbell_rows) AS barbell_rows,' +
      'MAX(overhead_press) AS overhead_press, ' +
      'MAX(deadlifts) AS deadlifts ' +
      'FROM workouts ' +
      'WHERE user_id = ?';
    var query = dbConnPool.query(queryString, userId, callback);
    logSqlIfVerbose(query);
  },

  updateWorkout: function(dbConnPool, workout, workoutDate, userId, callback) {
    var queryString = 'UPDATE workouts SET ? WHERE date = ? AND user_id = ?';
    var query = dbConnPool.query(queryString, [workout, workoutDate, userId], callback);
    logSqlIfVerbose(query);
  },

  deleteWorkout: function(dbConnPool, workoutDate, userId, callback) {
    var queryString = 'DELETE FROM workouts WHERE date = ? AND user_id = ?';
    var query = dbConnPool.query(queryString, [workoutDate, userId], callback);
    logSqlIfVerbose(query);
  }
};
