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
      $('#loading').hide();
      response['workouts'].forEach((row) => {
        let formattedDate = moment(row['workout_date']).format('YYYY-MM-DD'),
          workoutItem = $('<li>')
          .append(`<div id="date">Date of workout: ${formattedDate}</div>`)
          .append(`<div>Squats: ${row['squats']}`)
          .append(`<div>Bench Press: ${row['bench_press']}`)
          .append(`<div>Barbell Rows: ${row['barbell_rows']}`)
          .append(`<div>Overhead Press: ${row['overhead_press']}`)
          .append(`<div>Deadlifts: ${row['deadlifts']}`)
          .append('<div><a onclick="deleteWorkout(event)" href="#">Delete</a></div>')
          .append('<span id="delete-failure" style="display:none"></span>');
        $('ol').append(workoutItem);
      });
    } else if (response.status === 'failure') {
      $('#load-failure').text('Unable to fetch workouts. Reason: ' + response['message'])
        .fadeIn();
    }
  });
});