'use strict';

// External dependencies
var moment = require('moment'),
    LineChart = require('react-d3-basic').LineChart,
    React = require('react');

// ISO 8601 date format
var dateFormat = d3.time.format('%Y-%m-%dT%H:%M:%S.%LZ');

var WorkoutGraph = React.createClass({
  getInitialState: function() {
    return {
      chartSeries: [
        {
          field: 'squats',
          name: 'Squats',
          color: '#FF0000'
        },
        {
          field: 'bench_press',
          name: 'Bench Press',
          color: '#0000FF'
        },
        {
          field: 'barbell_rows',
          name: 'Barbell Rows',
          color: '#00FF00'
        },
        {
          field: 'overhead_press',
          name: 'Overhead Press',
          color: '#FFFF00'
        },
        {
          field: 'deadlifts',
          name: 'Deadlifts',
          color: '#00FFFF'
        }
      ],
      x: function(d) {
        // The x-axis is time
        return dateFormat.parse(d.date);
      },
      xScale: 'time'
      // TODO: Get scale ticks to day granularity
    };
  },
  render: function() {
    return (
      <div className="WorkoutGraph">
        <h2>Workout graph</h2>
        <LineChart
          width={this.props.width}
          height={this.props.height}
          margins={this.props.margins}
          data={this.props.workouts}
          chartSeries={this.state.chartSeries}
          x={this.state.x}
          xScale={this.state.xScale}
        />
      </div>
    );
  }
});

module.exports = WorkoutGraph;
