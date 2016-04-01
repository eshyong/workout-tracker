'use strict';

// Internal dependencies
var WorkoutForm = require('./WorkoutForm.jsx');

// External dependencies
var moment = require('moment'),
    React = require('react');

var WorkoutList = React.createClass({
  render: function() {
    var workoutNodes = this.props.data.map((workout) => {
      return (
        <Workout
          key={workout.id}
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

      // Change style when the user mouses over or mouses out on a workout
      highlighted: false,

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
      failure: false
    };
  },
  toggleEditingMode: function(e) {
    this.setState({
      editing: !this.state.editing,
      highlighted: false,
      success: false,
      failure: false
    });
  },
  onMouseOver: function(e) {
    this.setState({
      highlighted: true
    });
  },
  onMouseOut: function(e) {
    this.setState({
      highlighted: false
    });
  },
  render: function() {
    return (
      <div className="Workout">
      {
        this.state.editing ? (
          <WorkoutForm
            date={this.props.date}
            squats={this.props.squats}
            benchPress={this.props.benchPress}
            barbellRows={this.props.barbellRows}
            overheadPress={this.props.overheadPress}
            deadlifts={this.props.deadlifts}
            onWorkoutUpdate={this.props.onWorkoutUpdate}
            onWorkoutDelete={this.props.onWorkoutDelete}
            submitter={false}
          />
        ) :
          <div
            onClick={this.toggleEditingMode}
            onMouseOver={this.onMouseOver}
            onMouseOut={this.onMouseOut}
            style={
              // Signal highlighted button to user by changing style
              this.state.highlighted ? {
                background: 'lightgrey',
                cursor: 'pointer'
              } : null
            }
          >
            <div>Date: {this.props.date.format('MM-DD-YYYY')}</div>
            <div>Squats: {this.state.squats}</div>
            <div>Bench Press: {this.state.benchPress}</div>
            <div>Barbell Rows: {this.state.barbellRows}</div>
            <div>Overhead Press: {this.state.overheadPress}</div>
            <div>Deadlifts: {this.state.deadlifts}</div>
          </div>
      }
      </div>
    );
  }
});

module.exports = WorkoutList;
