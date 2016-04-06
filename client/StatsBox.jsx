'use strict';

// External dependencies
var React = require('react');

// Default precision for floating point numbers
const defaultPrecision = 1;

var StatsBox = React.createClass({
  getInitialState: function() {
    return {};
  },
  render: function() {
    // Display null workouts as 0
    return (
      <div className="StatsBox">
        <h3>Averages</h3>
        <div>Squats: {
          this.props.averages.squats ? (
            this.props.averages.squats.toFixed(defaultPrecision)
          ) : (
            '0'
          )
        } </div>
        <div>Bench press: {
          this.props.averages.benchPress ? (
            this.props.averages.benchPress.toFixed(defaultPrecision)
          ) : (
            '0'
          )
        } </div>
        <div>Barbell rows: {
          this.props.averages.barbellRows ? (
            this.props.averages.barbellRows.toFixed(defaultPrecision)
          ) : (
            '0'
          )
        } </div>
        <div>Overhead press: {
          this.props.averages.overheadPress ? (
            this.props.averages.overheadPress.toFixed(defaultPrecision)
          ) : (
            '0'
          )
        } </div>
        <div>Deadlifts: {
          this.props.averages.deadlifts ? (
            this.props.averages.deadlifts.toFixed(defaultPrecision)
          ) : (
            '0'
          )
        } </div>
        <h3>Max weights</h3>
        <div>Squats: {
          this.props.maxes.squats ? (
            this.props.maxes.squats.toFixed(defaultPrecision)
          ) : (
            '0'
          )
        } </div>
        <div>Bench press: {
          this.props.maxes.benchPress ? (
            this.props.maxes.benchPress.toFixed(defaultPrecision)
          ) : (
            '0'
          )
        } </div>
        <div>Barbell rows: {
          this.props.maxes.barbellRows ? (
            this.props.maxes.barbellRows.toFixed(defaultPrecision)
          ) : (
            '0'
          )
        } </div>
        <div>Overhead press: {
          this.props.maxes.overheadPress ? (
            this.props.maxes.overheadPress.toFixed(defaultPrecision)
          ) : (
            '0'
          )
        } </div>
        <div>Deadlifts: {
          this.props.maxes.deadlifts ? (
            this.props.maxes.deadlifts.toFixed(defaultPrecision)
          ) : (
            '0'
          )
        } </div>
      </div>
    );
  }
});

module.exports = StatsBox;
