'use strict';

let deleteWorkout = (event) => {
  let listParent = $(event.target).parents('li'),
    dateHtmlNode = $(listParent).find('#date'),
    workoutDate = dateHtmlNode.html().split(': ')[1];

  let data = JSON.stringify({
    date: workoutDate
  });
  let settings = {
    contentType: 'application/json',
    data: data,
    dataType: 'json',
    url: '/delete-workout'
  }
  $.post(settings).done((response) => {
    if (response.status === 'success') {
      $(listParent).slideUp().remove('div');
    } else if (response.status === 'failure') {
      $(listParent).find('#delete-failure')
        .text('Unable to delete workout. Reason: ' + response.message)
        .fadeIn()
        .delay(3000)
        .fadeOut();
    }
  });
};

$(document).ready(() => {
  console.log('viewWorkouts ready!');

  // Once loaded, request all workouts and show them on the page
  // TODO: page workouts
  let settings = {
    dataType: 'json',
    url: '/get-workouts'
  };
  $.get(settings, (response) => {
    if (response.status === 'success') {
      $('#loading-message').hide();
      response['workouts'].forEach((row) => {
        let formattedDate = moment(row['workout_date']).format('YYYY-MM-DD'),
          squats = row.squats,
          benchPress = row.bench_press,
          barbellRows = row.barbell_rows,
          overheadPress = row.overhead_press,
          deadlifts = row.deadlifts;
        let dateRow = $('<div>').addClass('workout-row').attr('id', 'date').html(`Date of workout: ${formattedDate}`),
          squatsRow = $('<div>').addClass('workout-row').html(`Squats: ${squats}`),
          benchPressRow = $('<div>').addClass('workout-row').html(`Bench Press: ${benchPress}`),
          barbellRowsRow = $('<div>').addClass('workout-row').html(`Barbell Rows: ${barbellRows}`),
          overheadPressRow = $('<div>').addClass('workout-row').html(`Overhead Press: ${overheadPress}`),
          deadliftsRow = $('<div>').addClass('workout-row').html(`Deadlifts: ${deadlifts}`),
          deleteButton = $('<div>').addClass('btn btn-default').attr('onclick', 'deleteWorkout(event)').html('Delete'),
          deleteFailure = $('<div>').attr('id', 'delete-failure');
        let workoutItem = $('<li>')
          .append(dateRow)
          .append(squatsRow)
          .append(benchPressRow)
          .append(barbellRowsRow)
          .append(overheadPressRow)
          .append(deadliftsRow)
          .append(deleteButton)
          .append(deleteFailure);
        $('ol').append(workoutItem);
      });
    } else if (response.status === 'failure') {
      $('#load-failure').text('Unable to fetch workouts. Reason: ' + response['message'])
        .fadeIn();
    }
  });
});
