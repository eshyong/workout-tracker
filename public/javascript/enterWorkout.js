'use strict';

$(document).ready(() => {
  console.log('ready!');

  $('.workout-selector[name="button-a"]').click((event) => {
    console.log('Workout A selected');
    $('#form-a').fadeIn('slow');
    $('#form-b').hide();
  });

  $('.workout-selector[name="button-b"]').click(() => {
    console.log('Workout B selected');
    $('#form-b').fadeIn('slow');
    $('#form-a').hide();
  });

  // Error function for form submission
  var showError = (fieldName) => {
    $('#failure').text('Please enter a positive number in the "' + fieldName + '" field.')
                 .fadeIn()
                 .delay(2000)
                 .fadeOut();
  }

  $('#form-a').submit((event) => {
    console.log('Submitting workout A');

    // Get input numbers from form
    var target = event.target;
    var squats = Number.parseInt($(target).find('#squats-a').val());
    var benchPress = Number.parseInt($(target).find('#bench-press').val());
    var overheadRows = Number.parseInt($(target).find('#overhead-rows').val());
    console.log('Squats: ' + squats + ', Bench Press: ' + benchPress +
                ', Overhead Rows: ' + overheadRows);

    // Confirm that inputs are positive integers
    if (isNaN(squats) || squats < 0) {
      showError('Squats');
      event.preventDefault();
      return;
    }

    if (isNaN(benchPress) || benchPress < 0) {
      showError('Bench Press');
      event.preventDefault();
      return;
    }

    if (isNaN(overheadRows) || overheadRows < 0) {
      showError('Overhead Rows');
      event.preventDefault();
      return;
    }

    // Send information to server
    var data = JSON.stringify({
      workoutType: 'A', 
      squats: squats,
      benchPress: benchPress,
      overheadRows: overheadRows
    });
    var settings = {
      contentType: 'application/json',
      data: data,
      dataType: 'json',
      url: '/enter-workout'
    };
    $.post(settings).done((response) => {
      if (response['status'] === 'success') {
        $('#success').text('Successfully entered workout! ').fadeIn();
        $('#success').append('<a href="workouts">View submitted workouts</a.');
      } else if (response['status'] === 'failure') {
        $('#failure').text('Sorry, we failed to process your workout. Reason: ' + response['message']);
      }
    });
    event.preventDefault();
  });
  
  $('#form-b').submit((event) => {
    console.log('Submitting workout B');

    // Get input numbers from form
    var target = event.target;
    var squats = Number.parseInt($(target).find('#squats-b').val());
    var overheadPress = Number.parseInt($(target).find('#overhead-press').val());
    var deadlifts = Number.parseInt($(target).find('#deadlifts').val());
    console.log('Squats: ' + squats + ', Overhead Press: ' + overheadPress +
                ', Deadlifts: ' + deadlifts);

    // Confirm that inputs are positive integers
    if (isNaN(squats) || squats < 0) {
      showError('Squats');
      event.preventDefault();
      return;
    }

    if (isNaN(overheadPress) || overheadPress < 0) {
      showError('Overhead Press');
      event.preventDefault();
      return;
    }

    if (isNaN(deadlifts) || deadlifts < 0) {
      showError('Deadlifts');
      event.preventDefault();
      return;
    }

    // Send information to server
    var data = JSON.stringify({
      workoutType: 'B', 
      squats: squats,
      overheadPress: overheadPress,
      deadlifts: deadlifts
    });
    var settings = {
      contentType: 'application/json',
      data: data,
      dataType: 'json',
      url: '/enter-workout'
    };
    $.post(settings).done((response) => {
      if (response['status'] === 'success') {
        $('#success').text('Successfully entered workout! ').fadeIn();
        $('#success').append('<a href="workouts">View submitted workouts</a.');
      } else if (response['status'] === 'failure') {
        $('#failure').text('Sorry, we failed to process your workout. Reason: ' + response['message']);
      }
    });
    event.preventDefault();
  });
});