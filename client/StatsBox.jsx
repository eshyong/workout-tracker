'use strict';

var React = require('react');

var StatsBox = React.createClass({
  getInitialState: function() {
    return {
      workouts: [],
      averages: {
        squats: 0,
        bench_press: 0,
        barbell_rows: 0,
        overhead_press: 0,
        deadlifts: 0
      },
      maxes: {
        squats: 0,
        bench_press: 0,
        barbell_rows: 0,
        overhead_press: 0,
        deadlifts: 0
      }
    };
  },
  render: function() {
    return (
      <div className="StatsBox">
        <h2>Workout stats</h2>
        <h3>Averages</h3>
        <h3>Max weights</h3>
      </div>
    );
  }
});

module.exports = StatsBox;
