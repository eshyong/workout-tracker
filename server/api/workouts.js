'use strict';

// Internal dependencies
const dbUtils = require('../dbUtils');
const workouts = require('../query/workouts');

// External dependencies
const express = require('express');

module.exports = function(database) {
  var router = express.Router();

  // API endpoints
  router.get('/get-all-workouts', function(req, res) {
    workouts.getWorkouts(database, req.session.userInfo.userId, function(err, results) {
      if (err) {
        // Generic DB error
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
  });

  router.get('/get-workout-averages', function(req, res) {
    workouts.getWorkoutAverages(database, req.session.userInfo.userId, function(err, results) {
      if (err) {
        // Generic DB error
        console.log('Encountered database err: ' + err.message);
        res.json({
          status: 'failure',
          message: 'Failed to query workouts.'
        });
        return;
      }
      var averages = results[0];
      res.json({
        status: 'success',
        averages: {
          squats: averages.squats,
          benchPress: averages.bench_press,
          barbellRows: averages.barbell_rows,
          overheadPress: averages.overhead_press,
          deadlifts: averages.deadlifts
        }
      });
    });
  });

  router.get('/get-workout-maxes', function(req, res) {
    workouts.getWorkoutMaxes(database, req.session.userInfo.userId, function(err, results) {
      if (err) {
        // Generic DB error
        console.log('Encountered database err: ' + err.message);
        res.json({
          status: 'failure',
          message: 'Failed to query workouts.'
        });
        return;
      }
      var maxes = results[0];
      res.json({
        status: 'success',
        maxes: {
          squats: maxes.squats,
          benchPress: maxes.bench_press,
          barbellRows: maxes.barbell_rows,
          overheadPress: maxes.overhead_press,
          deadlifts: maxes.deadlifts
        }
      });
    });
  });

  router.post('/submit-workout', function(req, res) {
    // Check if workout with same date exists before submitting
    var workout = req.body;
    workouts.getWorkoutByDate(database, req.session.userInfo.userId, workout.date,
      function(err, results) {
        if (err) {
          // Generic DB error
          console.log('Encountered database err: ' + err.message);
          res.json({
            status: 'failure',
            message: 'Failed to query workouts.'
          });
          return;
        }
        if (results.length) {
          res.json({
            status: 'failure',
            message: 'A workout with that date already exists.'
          });
          return;
        }
        // Add user ID to DB request
        workout['user_id'] = req.session.userInfo.userId;

        // Submit workout
        workouts.submitWorkout(database, req.body, function(err) {
          if (err) {
            console.log('Encountered database err: ' + err.message);
            if (
              err.code === 'ER_TRUNCATED_WRONG_VALUE_FOR_FIELD' ||
              err.code === 'ER_WARN_DATA_OUT_OF_RANGE'
            ) {
              // Invalid user input error
              res.json({
                status: 'failure',
                message: 'Invalid input - please check that your exercise weights are ' +
                  'positive integers.'
              });
            } else {
              // Generic error
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
      }
    );
  });

  router.post('/update-workout', function(req, res) {
    workouts.updateWorkout(database,
      req.body, req.body.date, req.session.userInfo.userId,
      function(err, result) {
        if (err) {
          console.log('Encountered database err: ' + err.message);
          if (err.code === 'ER_DUP_ENTRY') {
            // Duplicate workout error
            res.json({
              status: 'failure',
              message: 'A workout with that date already exists.'
            });
          } else if (
            err.code === 'ER_TRUNCATED_WRONG_VALUE_FOR_FIELD' ||
            err.code === 'ER_WARN_DATA_OUT_OF_RANGE'
          ) {
            // Invalid user input error
            res.json({
              status: 'failure',
              message: 'Invalid input - please check that your exercise weights are ' +
                'positive integers.'
            });
          } else {
            // Generic DB error
            res.json({
              status: 'failure',
              message: 'Failed to update workout.'
            });
          }
          return;
        }
        // Catch MySQL warnings
        if (result.affectedRows === 0 || result.warningCount > 0) {
          console.log('No error thrown, but failed to update row');
          dbUtils.showWarnings(database, function(err, result) {
            if (err) {
              throw err;
            }
            if (result) {
              console.log(`Warning: ${result[0].Message}`);
            }
          });
          res.json({
            status: 'failure',
            message: 'Failed to update workout.'
          });
          return;
        }
        res.json({
          status: 'success',
          message: 'Successfully updated workout.'
        });
      });
  });

  router.post('/delete-workout', function(req, res) {
    workouts.deleteWorkout(database, req.body.date, req.session.userInfo.userId,
      function(err, result) {
        if (err) {
          // Generic DB error
          console.log('Encountered database err: ' + err.message);
          res.json({
            status: 'failure',
            message: 'Failed to delete workout.'
          });
          return;
        }
        // Catch MySQL warnings
        if (result.affectedRows === 0 || result.warningCount > 0) {
          console.log('No error thrown, but failed to delete row');
          dbUtils.showWarnings(database, function(err, result) {
            if (err) {
              throw err;
            }
            if (result) {
              console.log(`Warning: ${result[0].Message}`);
            }
          });
          res.json({
            status: 'failure',
            message: 'Failed to delete workout.'
          });
          return;
        }
        res.json({
          status: 'success'
        });
      }
    );
  });

  return router;
}
