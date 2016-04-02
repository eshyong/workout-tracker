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
      success: '',
      failure: ''
    }
  },
  handleInputChange: function(e) {
    var workoutType = e.target.id,
      newValue = e.target.value;
    if (workoutType === 'date') {
      newValue = moment.utc(newValue);
    }
    this.setState({
      [workoutType]: newValue,
      success: '',
      failure: ''
    });
  },
  handleRequest: function(e, requestFunc, input, successMessage) {
    e.preventDefault();
    requestFunc(input, (response) => {
      // Set success or failure messages accordingly
      if (response.status === 'failure') {
        this.setState({
          success: '',
          failure: response.message
        });
      } else if (response.status === 'success') {
        this.setState({
          success: successMessage,
          failure: ''
        });
      } else {
        console.log(`Unknown status: ${response.status}`);
      }
    });
  },
  handleSubmit: function(e) {
    var input = {
      squats: this.state.squats,
      bench_press: this.state.benchPress,
      barbell_rows: this.state.barbellRows,
      overhead_press: this.state.overheadPress,
      deadlifts: this.state.deadlifts,
      // Dates need to be in the MySQL format 'YYYY-MM-DD'
      date: this.state.date.format('YYYY-MM-DD')
    };
    this.handleRequest(e, this.props.onWorkoutSubmit, input, 'Successfully submitted workout.');
  },
  handleUpdate: function(e) {
    var input = {
      squats: this.state.squats,
      bench_press: this.state.benchPress,
      barbell_rows: this.state.barbellRows,
      overhead_press: this.state.overheadPress,
      deadlifts: this.state.deadlifts,
      // Dates need to be in the MySQL format 'YYYY-MM-DD'
      date: this.state.date.format('YYYY-MM-DD')
    };
    this.handleRequest(e, this.props.onWorkoutUpdate, input, 'Successfully updated workout.');
  },
  handleDelete: function(e) {
    var input = {
      // Dates need to be in the MySQL format 'YYYY-MM-DD'
      date: this.state.date.format('YYYY-MM-DD')
    };
    this.handleRequest(e, this.props.onWorkoutDelete, input, 'Successfully deleted workout.');
  },
  render: function() {
    return (
      <div className="WorkoutForm">
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
          {
            // If the form is a "submitter" form, then it INSERTs workouts
            // If not, it UPDATEs or DELETEs them
            this.props.submitter ?
              (
                <input
                  className="btn btn-default"
                  type="submit"
                  value="Submit"
                />
              ) :
              (
                [
                  <input
                    className="btn btn-default"
                    type="button"
                    value="Update"
                    onClick={this.handleUpdate}
                    key="update"
                  />,
                  <input
                    className="btn btn-default"
                    type="button"
                    value="Delete"
                    onClick={this.handleDelete}
                    key="delete"
                  />
                ]
              )
          }
        </form>
        {
          this.state.success ? (
            <div className="successMessage">{this.state.success}</div>
          ) : null
        }
        {
          this.state.failure ? (
            <div className="failureMessage">{this.state.failure}</div>
          ) : null
        }
      </div>
    );
  }
});

module.exports = WorkoutForm;