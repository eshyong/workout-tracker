'use strict';

var moment = require('moment'),
    React = require('react');

var WorkoutForm = React.createClass({
  getInitialState: function() {
    return {
      // The data fields of a workout
      date: this.props.date,
      squats: this.props.squats,
      benchPress: this.props.benchPress,
      barbellRows: this.props.barbellRows,
      overheadPress: this.props.overheadPress,
      deadlifts: this.props.deadlifts,

      // These are set whenever an operation on a workout is performed,
      // such as an update or delete
      success: false,
      failure: false,
      successMessage: '',
      failureMessage: ''
    }
  },
  handleInputChange: function(e) {
    var workoutType = e.target.id,
      newValue = e.target.value;
    if (workoutType === 'date') {
      newValue = moment.utc(newValue);
    }
    this.setState({
      [workoutType]: newValue
    });
  },
  handleSubmit: function(e) {
    e.preventDefault();
    this.props.onWorkoutSubmit({
      squats: this.state.squats,
      bench_press: this.state.benchPress,
      barbell_rows: this.state.barbellRows,
      overhead_press: this.state.overheadPress,
      deadlifts: this.state.deadlifts,
      // Dates need to be in the MySQL format 'YYYY-MM-DD'
      date: this.state.date.format('YYYY-MM-DD')
    }, (response) => {
      // Set success or failure messages accordingly
      if (response.status === 'failure') {
        this.setState({
          success: false,
          failure: true,
          failureMessage: response.message
        });
      } else if (response.status === 'success') {
        this.setState({
          success: true,
          failure: false,
          successMessage: 'Successfully submitted workout.'
        });
      } else {
        console.log(`Unknown status: ${response.status}`);
      }
    });
  },
  render: function() {
    return (
      <div className="WorkoutForm">
        <h2>Submit a new Workout</h2>
        <form onSubmit={this.handleSubmit}>
          <div>Workout Date:
            <input
              type="date"
              defaultValue={this.state.date.format('YYYY-MM-DD')}
              onChange={this.handleInputChange}
              id="date"
            />
          </div>
          <div>Squats:
            <input
              type="text"
              defaultValue={this.state.squats}
              onChange={this.handleInputChange}
              id="squats"
            />
          </div>
          <div>Bench Press:
            <input
              type="text"
              defaultValue={this.state.benchPress}
              onChange={this.handleInputChange}
              id="benchPress"
            />
          </div>
          <div>Barbell Rows:
            <input
              type="text"
              defaultValue={this.state.barbellRows}
              onChange={this.handleInputChange}
              id="barbellRows"
            />
          </div>
          <div>Overhead Press:
            <input
              type="text"
              defaultValue={this.state.overheadPress}
              onChange={this.handleInputChange}
              id="overheadPress"
            />
          </div>
          <div>Deadlifts:
            <input
              type="text"
              defaultValue={this.state.deadlifts}
              onChange={this.handleInputChange}
              id="deadlifts"
            />
          </div>
          <input
            className="btn btn-default"
            type="submit"
            value="Submit"
            id="submitWorkout"
          />
        </form>
        {
          this.state.success ? (
            <div className="successMessage">{this.state.successMessage}</div>
          ) : null
        }
        {
          this.state.failure ? (
            <div className="failureMessage">{this.state.failureMessage}</div>
          ) : null
        }
      </div>
    );
  }
});

module.exports = WorkoutForm;
