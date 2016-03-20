'use strict';

// TODO: codify schema in a migrations script

module.exports = {
  submitWorkout: (dbConn, workout, res) => {
    console.log('submitWorkout');
    let query = dbConn.query('INSERT INTO workouts SET ?', workout, (err) => {
      if (err) {
        console.log('Encountered database err: ' + err.message);
        if (err.code === 'ER_DUP_ENTRY') {
          res.json({
            status: 'failure',
            message: 'A workout with that date already exists.'
          });
        } else {
          res.json({
            status: 'failure',
            message: 'Unable to insert or replace workout.'
          });
        }
        return;
      }
      console.log('Successfully added workout.');
      res.json({
        status: 'success'
      });
    });
    console.log(query.sql);
  },

  getWorkouts: (dbConn, res) => {
    console.log('getWorkouts');
    let queryString = 'SELECT squats, bench_press, barbell_rows, ' +
      'overhead_press, deadlifts, date FROM workouts';
    let query = dbConn.query(queryString, (err, results) => {
      if (err) {
        console.log('Encountered database err: ' + err.message);
        res.json({
          status: 'failure',
          message: 'Unable to query workouts.'
        });
        return;
      }
      res.json({
        status: 'success',
        workouts: results
      });
    });
    console.log(query.sql);
  },

  deleteWorkout: (dbConn, workout, res) => {
    console.log('deleteWorkout');
    let workoutDate = workout.date,
      queryString = 'DELETE FROM workouts WHERE date = ?';

    let query = dbConn.query(queryString, workoutDate, (err) => {
      if (err) {
        console.log('Encountered database err: ' + err.message);
        res.json({
          status: 'failure',
          message: 'Unable to delete workout.'
        });
        return;
      }
      res.json({
        status: 'success'
      });
    });
    console.log(query.sql);
  }
}
