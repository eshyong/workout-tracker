'use strict';

module.exports = {
  submitWorkout: (dbConn, workout, res) => {
    // If a workout for a given date already exists, replace it instead.
    let query = dbConn.query('REPLACE INTO workouts SET ?', workout, (err) => {
      if (err) {
        console.log('Encountered database err: ' + err.message);
        res.json({
          'status': 'failure',
          'message': err.message
        });
        return;
      }
      console.log('Successfully added workout.');
      res.json({'status': 'success'});
    });
    console.log(query.sql);
  }
}