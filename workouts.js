'use strict';

// TODO: codify schema in a migrations script

module.exports = {
  submitWorkout: function(dbConn, workout, res) {
    var query = dbConn.query('INSERT INTO workouts SET ?', workout, function(err) {
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

  getWorkouts: function(dbConn, res) {
    var queryString = 'SELECT id, squats, bench_press, barbell_rows, ' +
      'overhead_press, deadlifts, date FROM workouts';
    var query = dbConn.query(queryString, function(err, results) {
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

  updateWorkout: function(dbConn, workout, res) {
    var workoutDate = workout.date,
      queryString = 'UPDATE workouts SET ? WHERE date = ?';

    var query = dbConn.query(queryString, [workout, workoutDate], function(err, result) {
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

  deleteWorkout: function(dbConn, workout, res) {
    var workoutDate = workout.date,
      queryString = 'DELETE FROM workouts WHERE date = ?';

    var query = dbConn.query(queryString, workoutDate, function(err) {
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
