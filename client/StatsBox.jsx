'use strict';

var React = require('react');

var StatsBox = React.createClass({
  getInitialState: function() {
    return {};
  },
  render: function() {
    return (
      <div className="StatsBox">
        <h2>Workout stats</h2>
        <h3>Averages</h3>
        <div>Squats: {this.props.averages.squats}</div>
        <div>Bench press: {this.props.averages.benchPress}</div>
        <div>Barbell rows: {this.props.averages.barbellRows}</div>
        <div>Overhead press: {this.props.averages.overheadPress}</div>
        <div>Deadlifts: {this.props.averages.deadlifts}</div>
        <h3>Max weights</h3>
        <div>Squats: {this.props.maxes.squats}</div>
        <div>Bench press: {this.props.maxes.benchPress}</div>
        <div>Barbell rows: {this.props.maxes.barbellRows}</div>
        <div>Overhead press: {this.props.maxes.overheadPress}</div>
        <div>Deadlifts: {this.props.maxes.deadlifts}</div>
      </div>
    );
  }
});

module.exports = StatsBox;
