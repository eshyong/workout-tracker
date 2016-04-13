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
          isTypeA={Boolean(workout.is_type_a)}
          onWorkoutUpdate={this.props.onWorkoutUpdate}
          onWorkoutDelete={this.props.onWorkoutDelete}
        />
      );
    });
    return (
      <div className="WorkoutList">
        {
          workoutNodes.length === 0 ? (
            <div>You haven't added any workouts yet. Try adding one above!</div>
          ) : (
            workoutNodes
          )
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
      // If we receive NULL fields, turn them into "0"s
      date: this.props.date,
      squats: this.props.squats === 'null' ? '0' : this.props.squats,
      benchPress: this.props.benchPress === 'null' ? '0' : this.props.benchPress,
      barbellRows: this.props.barbellRows === 'null' ? '0' : this.props.barbellRows,
      overheadPress: this.props.overheadPress === 'null' ? '0' : this.props.overheadPress,
      deadlifts: this.props.deadlifts === 'null' ? '0' : this.props.deadlifts,
    };
  },
  toggleEditingMode: function(e) {
    this.setState({
      editing: !this.state.editing,
      highlighted: false,
    });
  },
  render: function() {
    var dataFields;
    if (this.props.isTypeA) {
      dataFields = [
        <div key="date">Date: {this.props.date.format('MM-DD-YYYY')}</div>,
        <div key="squats">Squats: {this.state.squats}</div>,
        <div key="benchPress">Bench Press: {this.state.benchPress}</div>,
        <div key="barbellRows">Barbell Rows: {this.state.barbellRows}</div>
      ];
    } else {
      dataFields = [
        <div key="date">Date: {this.props.date.format('MM-DD-YYYY')}</div>,
        <div key="squats">Squats: {this.state.squats}</div>,
        <div key="overheadPress">Overhead Press: {this.state.overheadPress}</div>,
        <div key="deadlifts">Deadlifts: {this.state.deadlifts}</div>
      ];
    }
    var style = {background: this.state.editing ? '#EEEEEE' : 'white'};
    return (
      <div className="Workout" style={style}>
        {
          this.state.editing ? (
            <WorkoutForm
              date={this.props.date}
              squats={this.props.squats}
              benchPress={this.props.benchPress}
              barbellRows={this.props.barbellRows}
              overheadPress={this.props.overheadPress}
              deadlifts={this.props.deadlifts}
              isTypeA={this.props.isTypeA}
              onWorkoutUpdate={this.props.onWorkoutUpdate}
              onWorkoutDelete={this.props.onWorkoutDelete}
              submitter={false}
            />
          ) : (
            <div>
              {dataFields}
            </div>
          )
        }
        <button
          className="btn btn-default"
          onClick={this.toggleEditingMode}
        >
          Edit
        </button>
      </div>
    );
  }
});

module.exports = WorkoutList;
