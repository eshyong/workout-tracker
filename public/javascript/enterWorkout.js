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
    event.preventDefault();

    // Get input numbers for each exercise, as well as the date of the workout, from the form.
    let target = event.target,
        squats = Number.parseInt($(target).find('#squats').val()),
        benchPress = Number.parseInt($(target).find('#bench-press').val()),
        barbellRows = Number.parseInt($(target).find('#barbell-rows').val()),
        overheadPress = Number.parseInt($(target).find('#overhead-press').val()),
        deadlifts = Number.parseInt($(target).find('#deadlifts').val()),
        workoutDate = $(target).find('#date').val() || moment().format('YYYY-MM-DD');
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
      return;
    }
    if (!validateIntegerOrShowError(benchPress, 'Bench Press')) {
      return;
    }
    if (!validateIntegerOrShowError(barbellRows, 'Barbell Rows')) {
      return;
    }
    if (!validateIntegerOrShowError(overheadPress, 'Overhead Press')) {
      return;
    }
    if (!validateIntegerOrShowError(deadlifts, 'Deadlifts')) {
      return;
    }

    // At least one exercise should be non-zero
    if (squats === 0 && benchPress === 0 && barbellRows === 0 &&
        overheadPress === 0 && deadlifts === 0) {
      showError('Please enter at least one non-zero exercise weight.');
      return;
    }

    // Make sure date isn't in the future
    if (moment(workoutDate).unix() > moment().unix()) {
      showError('Workout date must not be in the future, unless you are marty mcfly');
      return;
    }

    // Send information to server
    let data = JSON.stringify({
      squats: squats,
      bench_press: benchPress,
      barbell_rows: barbellRows,
      overhead_press: overheadPress,
      deadlifts: deadlifts,
      workout_date: workoutDate
    });
    let settings = {
      contentType: 'application/json',
      data: data,
      dataType: 'json',
      url: '/submit-workout'
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
  });
});
