'use strict';

function logSqlIfVerbose(query) {
  var nodeEnv = process.env.NODE_ENV;
  var logSql = process.env.LOG_SQL;
  if (nodeEnv === 'development' && logSql === 'true') {
    console.log(query.sql);
  }
}

module.exports = {
  submitWorkout: function(dbConn, workout, callback) {
    var query = dbConn.query('INSERT INTO workouts SET ?', workout, callback);
    logSqlIfVerbose(query);
  },

  getWorkouts: function(dbConn, userId, callback) {
    var queryString = 'SELECT id, squats, bench_press, barbell_rows, ' +
      'overhead_press, deadlifts, date ' +
      'FROM workouts ' +
      'WHERE user_id = ?';
    var query = dbConn.query(queryString, userId, callback);
    logSqlIfVerbose(query);
  },

  updateWorkout: function(dbConn, workout, workoutDate, userId, callback) {
    var queryString = 'UPDATE workouts SET ? WHERE date = ? AND user_id = ?';
    var query = dbConn.query(queryString, [workout, workoutDate, userId], callback);
    logSqlIfVerbose(query);
  },

  deleteWorkout: function(dbConn, workoutDate, userId, callback) {
    var queryString = 'DELETE FROM workouts WHERE date = ? AND user_id = ?';
    var query = dbConn.query(queryString, [workoutDate, userId], callback);
    logSqlIfVerbose(query);
  }
};
