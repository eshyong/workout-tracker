'use strict';

$(document).ready(() => {
  console.log('ready!');

  // Error function for form submission
  var showError = (message) => {
    $('#failure').text(message)
                 .fadeIn()
                 .delay(2000)
                 .fadeOut();
  }

  // Set the default value for the date input to be today.
  $('#date').val(moment().format('YYYY-MM-DD'));

  $('#workout-form').submit((event) => {
    console.log('Submitting workout');

    // Get input numbers for each exercise, as well as the date of the workout, from the form.
    var target = event.target,
        squats = Number.parseInt($(target).find('#squats').val()),
        benchPress = Number.parseInt($(target).find('#bench-press').val()),
        barbellRows = Number.parseInt($(target).find('#barbell-rows').val()),
        overheadPress = Number.parseInt($(target).find('#overhead-press').val()),
        deadlifts = Number.parseInt($(target).find('#deadlifts').val()),
        date = $(target).find('#date').val() || moment().format('YYYY-MM-DD');
    console.log('Squats: ' + squats + ', Bench Press: ' + benchPress +
                ', Barbell Rows: ' + barbellRows +
                ', Overhead Press: ' + overheadPress +
                ', Deadlifts: ' + deadlifts);

    // Confirm that inputs are positive integers
    var validateIntegerOrShowError = (exerciseWeight, exerciseName) => {
      if (isNaN(exerciseWeight) || exerciseWeight < 0) {
        showError('Please enter a positive number in the "' + exerciseName + '" field.');
        return false;
      }
      return true;
    }

    if (!validateIntegerOrShowError(squats, 'Squats')) {
      event.preventDefault();
      return;
    }
    if (!validateIntegerOrShowError(benchPress, 'Bench Press')) {
      event.preventDefault();
      return;
    }
    if (!validateIntegerOrShowError(barbellRows, 'Barbell Rows')) {
      event.preventDefault();
      return;
    }
    if (!validateIntegerOrShowError(overheadPress, 'Overhead Press')) {
      event.preventDefault();
      return;
    }
    if (!validateIntegerOrShowError(deadlifts, 'Deadlifts')) {
      event.preventDefault();
      return;
    }

    if (squats === 0 && benchPress === 0 && barbellRows === 0 &&
        overheadPress === 0 && deadlifts === 0) {
      showError('Please enter at least one non-zero exercise weight.');
      event.preventDefault();
      return;
    }

    // Send information to server
    var data = JSON.stringify({
      squats: squats,
      bench_press: benchPress,
      barbell_rows: barbellRows,
      overhead_press: overheadPress,
      deadlifts: deadlifts,
      date: date
    });
    var settings = {
      contentType: 'application/json',
      data: data,
      dataType: 'json',
      url: '/enter-workout'
    };
    $.post(settings).done((response) => {
      if (response['status'] === 'success') {
        $('#success').text('Successfully entered workout! ');
        $('#success').append('<a href="workouts">View submitted workouts</a>.');
        $('#success').fadeIn().delay(5000).fadeOut();
      } else if (response['status'] === 'failure') {
        $('#failure').text('Sorry, we failed to process your workout. Reason: ' +
                           response['message']);
        $('#failure').fadeIn().delay(5000).fadeOut();
      }
    });
    event.preventDefault();
  });
});