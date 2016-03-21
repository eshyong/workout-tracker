'use strict';

// TODO: codify schema in a migrations script

module.exports = {
  submitWorkout: (dbConn, workout, res) => {
    let query = dbConn.query('INSERT INTO workouts SET ?', workout, (err) => {
      if (err) {
        console.log('Encountered database err: ' + err.message);
        if (err.code === 'ER_DUP_ENTRY') {
          res.json({
            status: 'failure',
            message: 'A workout with that date already exists.'
          });
        } else if (
          err.code === 'ER_TRUNCATED_WRONG_VALUE_FOR_FIELD' ||
          err.code === 'ER_WARN_DATA_OUT_OF_RANGE'
        ) {
          res.json({
            status: 'failure',
            message: 'Invalid input - please check that your exercise weights are ' +
              'positive integers.'
          });
        } else {
          res.json({
            status: 'failure',
            message: 'Failed to insert workout.'
          });
        }
        return;
      }
      console.log('Successfully added workout.');
      res.json({
        status: 'success'
      });
    });
  },

  getWorkouts: (dbConn, res) => {
    let queryString = 'SELECT id, squats, bench_press, barbell_rows, ' +
      'overhead_press, deadlifts, date FROM workouts';
    let query = dbConn.query(queryString, (err, results) => {
      if (err) {
        console.log('Encountered database err: ' + err.message);
        res.json({
          status: 'failure',
          message: 'Failed to query workouts.'
        });
        return;
      }
      res.json({
        status: 'success',
        workouts: results
      });
    });
  },

  updateWorkout: (dbConn, workout, res) => {
    let workoutDate = workout.date,
      queryString = 'UPDATE workouts SET ? WHERE date = ?';

    let query = dbConn.query(queryString, [workout, workoutDate], (err, result) => {
      if (err) {
        console.log('Encountered database err: ' + err.message);
        res.json({
          status: 'failure',
          message: 'Failed to update workout.'
        });
        return;
      }
      res.json({
        status: 'success',
        message: 'Successfully updated workout.'
      })
    });
  },

  deleteWorkout: (dbConn, workout, res) => {
    let workoutDate = workout.date,
      queryString = 'DELETE FROM workouts WHERE date = ?';

    let query = dbConn.query(queryString, workoutDate, (err) => {
      if (err) {
        console.log('Encountered database err: ' + err.message);
        res.json({
          status: 'failure',
          message: 'Failed to delete workout.'
        });
        return;
      }
      res.json({
        status: 'success'
      });
    });
  }
}
