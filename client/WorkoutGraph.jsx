'use strict';

// External dependencies
const moment = require('moment');
const LineTooltip = require('react-d3-tooltip').LineTooltip;
const React = require('react');

// ISO 8601 date format
const dateFormat = d3.time.format('%Y-%m-%dT%H:%M:%S.%LZ');
const domainTopPadding = 0.25;

var WorkoutGraph = React.createClass({
  getInitialState: function() {
    return {
      x: function(d) {
        // The x-axis is time
        return dateFormat.parse(d.date);
      },
      xScale: 'time'
    };
  },
  render: function() {
    // Filter out all nulled exercises
    var workouts = this.props.workouts.filter((workout) => {
      return workout[this.props.fieldName] !== null;
    });

    // Get the max so we can calculate padding at the top of the graph
    var max = 0;
    workouts.forEach((workout) => {
      if (max < workout[this.props.fieldName]) {
        max = workout[this.props.fieldName];
      }
    });

    return (
      <div className="WorkoutGraph">
        <h3>{this.props.title}</h3>
        <LineTooltip
          width={this.props.width}
          height={this.props.height}
          margins={this.props.margins}
          data={workouts}
          chartSeries={this.props.chartSeries}
          x={this.state.x}
          xLabel="Date"
          yLabel="Weight (lb)"
          yDomain={
            // Increase the domain of the graph so there's some padding at
            // the top
            [0, max + domainTopPadding * max]
          }
          xScale={this.state.xScale}
        />
      </div>
    );
  }
});

module.exports = WorkoutGraph;
