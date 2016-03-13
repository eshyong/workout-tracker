'use strict';

$(document).ready(() => {
  console.log('viewWorkouts ready!');

  // Once loaded, request all workouts and show them on the page
  // TODO: page workouts
  let settings = {
    dataType: 'json',
    url: '/get-workouts'
  };
  $.get(settings, (response) => {
    if (response['status'] === 'success') {
      $('#loading').hide();
      response['workouts'].forEach((row) => {
        let formattedDate = moment(row['workout_date']).format('YYYY-MM-DD');
        let workoutItem = $('<li>')
          .append(`<div>Date of workout: ${formattedDate}</div>`)
          .append(`<div>Squats: ${row['squats']}`)
          .append(`<div>Bench Press: ${row['bench_press']}`)
          .append(`<div>Barbell Rows: ${row['barbell_rows']}`)
          .append(`<div>Overhead Press: ${row['overhead_press']}`)
          .append(`<div>Deadlifts: ${row['deadlifts']}`);
        $('ol').append(workoutItem);
      });
    } else if (response['status'] === 'failure') {
      $('#failure').text('Unable to fetch workouts. Reason: ' + response['message'])
        .fadeIn();
    }
  });
});
