'use strict';

var moment = require('moment'),
    React = require('react');

var WorkoutList = React.createClass({
  render: function() {
    var workoutNodes = this.props.data.map((workout) => {
      return (
        <Workout key={workout.id}
          date={moment.utc(workout.date)}
          squats={String(workout.squats)}
          benchPress={String(workout.bench_press)}
          barbellRows={String(workout.barbell_rows)}
          overheadPress={String(workout.overhead_press)}
          deadlifts={String(workout.deadlifts)}
          onWorkoutUpdate={this.props.onWorkoutUpdate}
          onWorkoutDelete={this.props.onWorkoutDelete}
        />
      );
    });
    return (
      <div className="WorkoutList">
        <h2>Workouts</h2>
        {
          workoutNodes.length === 0 ?
            <div>You haven't added any workouts yet. Try adding one above!</div>
            : workoutNodes
        }
      </div>
    );
  }
});

var Workout = React.createClass({
  getInitialState: function() {
    return {
      // A flag that specifies whether workout is in editing
      // mode or not
      editing: false,

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
    };
  },
  toggleEditingMode: function(e) {
    this.setState({
      editing: !this.state.editing,
      success: false,
      failure: false,
      successMessage: '',
      failureMessage: ''
    });
  },
  handleInputChange: function(e) {
    var workoutType = e.target.id,
      newValue = e.target.value;
    this.setState({
      [workoutType]: newValue
    });
  },
  handleUpdate: function(e) {
    // Send an UPDATE request to the API server
    this.props.onWorkoutUpdate({
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
          successMessage: 'Successfully updated workout.'
        });
      } else {
        console.log(`Unknown status: ${response.status}`);
      }
    });
  },
  handleDelete: function(e) {
    // Send a DELETE request to the API server
    this.props.onWorkoutDelete({
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
          successMessage: 'Successfully deleted workout.'
        });
      } else {
        console.log(`Unknown status: ${response.status}`);
      }
    });
  },
  render: function() {
    return (
      <form className="Workout">
        <div>Date: {this.props.date.format('MM-DD-YYYY')}</div>
        <div>Squats:
          {
            this.state.editing ? (
              <input
                defaultValue={this.state.squats}
                onChange={this.handleInputChange}
                id="squats"
              />
            ) : ` ${this.state.squats}`
          }
        </div>
        <div>Bench Press:
          {
            this.state.editing ? (
              <input
                defaultValue={this.state.benchPress}
                onChange={this.handleInputChange}
                id="benchPress"
              />
            ) : ` ${this.state.benchPress}`
          }
        </div>
        <div>Barbell Rows:
          {
            this.state.editing ? (
              <input
                defaultValue={this.state.barbellRows}
                onChange={this.handleInputChange}
                id="barbellRows"
              />
            ) : ` ${this.state.barbellRows}`
          }
        </div>
        <div>Overhead Press:
          {
            this.state.editing ? (
              <input
                defaultValue={this.state.overheadPress}
                onChange={this.handleInputChange}
                id="overheadPress"
              />
            ) : ` ${this.state.overheadPress}`
          }
        </div>
        <div>Deadlifts:
          {
            this.state.editing ? (
              <input
                defaultValue={this.state.deadlifts}
                onChange={this.handleInputChange}
                id="deadlifts"
              />
            ) : ` ${this.state.deadlifts}`
          }
        </div>
        <input
          className="btn btn-default"
          type="button"
          value="Edit"
          onClick={this.toggleEditingMode}
        />
        {
          // If not editing, hide the submit and delete buttons
          this.state.editing ? [
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
          ] : null
        }
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
      </form>
    );
  }
});

module.exports = WorkoutList;
