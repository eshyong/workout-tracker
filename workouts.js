'use strict';

module.exports = {
  submitWorkout: (dbConn, workout, res) => {
    // If a workout for a given date already exists, replace it instead.
    let query = dbConn.query('REPLACE INTO workouts SET ?', workout, (err) => {
      if (err) {
        console.log('Encountered database err: ' + err.message);
        res.json({
          'status': 'failure',
          'message': 'Unable to insert or replace workout.'
        });
        return;
      }
      console.log('Successfully added workout.');
      res.json({
        'status': 'success'
      });
    });
    console.log(query.sql);
  },

  getWorkouts: (dbConn, res) => {
    let queryString = 'SELECT squats, bench_press, barbell_rows, ' +
      'overhead_press, deadlifts, workout_date FROM workouts';
    let query = dbConn.query(queryString, (err, results) => {
      if (err) {
        console.log('Encountered database err: ' + err.message);
        res.json({
          'status': 'failure',
          'message': 'Unable to query workouts.'
        });
      }
      res.json({
        'status': 'success',
        'workouts': results
      });
    });
    console.log(query.sql);
  }
}