'use strict';

// Internal dependencies
var Navbar = require('./Navbar.jsx'),
    StatsBox = require('./StatsBox.jsx'),
    WorkoutGraph = require('./WorkoutGraph.jsx');

// External dependencies
var React = require('react'),
    ReactDOM = require('react-dom');

var StatsPage = React.createClass({
  getInitialState: function() {
    return {
      workouts: [],
      averages: {},
      maxes: {}
    };
  },
  handleGet: function(url, callback) {
    $.get({
      url: url,
      dataType: 'json',
      success: callback,
      failure: (xhr, status, err) => {
        console.err(this.props.getUrl, status, err.toString());
      }
    });
  },
  // Load workout statistics from the server
  loadWorkoutsFromServer: function() {
    this.handleGet(this.props.getUrl, (data) => {
      this.setState({
        workouts: data.workouts
      });
    });
  },
  loadWorkoutAveragesFromServer: function() {
    this.handleGet(this.props.avgUrl, (data) => {
      this.setState({
        averages: data.averages
      });
    });
  },
  loadWorkoutMaxesFromServer: function() {
    this.handleGet(this.props.maxUrl, (data) => {
      this.setState({
        maxes: data.maxes
      });
    });
  },
  componentDidMount: function() {
    this.loadWorkoutsFromServer();
    this.loadWorkoutAveragesFromServer();
    this.loadWorkoutMaxesFromServer();
  },
  render: function() {
    // Same attributes for each graph
    var width = 700;
    var height = 300;
    var margins = {
      left: 100,
      right: 100,
      top: 50,
      bottom: 50
    };
    var aWorkoutCount = 0;
    var bWorkoutCount = 0;
    this.state.workouts.forEach(function(workout) {
      if (workout.is_type_a) {
        aWorkoutCount += 1;
      } else {
        bWorkoutCount += 1;
      }
    });
    var showGraphs = (aWorkoutCount >= 3) && (bWorkoutCount >= 3);
    return (
      <div className="StatsPage">
        <Navbar
          items={
            // List of navbar items
            [
              {
                active: false,
                link: '/',
                text: 'Home'
              },
              {
                active: true,
                link: '#',
                text: 'Stats'
              },
              {
                active: false,
                link: '/profile',
                text: 'Profile'
              },
              {
                active: false,
                link: '/logout',
                text: 'Logout'
              }
            ]
          }
        />
        <h2>Workout stats</h2>
        <StatsBox
          averages={this.state.averages}
          maxes={this.state.maxes}
        />
        <h2>Workout graphs</h2>
        {
          !showGraphs ? (
            <div className="notEnoughWorkouts">
              Please add at least 3 workouts of each type to see your graphs.
            </div>
          ) : (
            <div>
              <WorkoutGraph
                title="Squats"
                workouts={this.state.workouts}
                fieldName="squats"
                chartSeries={
                  [
                    {
                      field: 'squats',
                      name: 'Squats',
                      color: '#FF0000'
                    }
                  ]
                }
                width={width}
                height={height}
                margins={margins}
              />
              <WorkoutGraph
                title="Bench Press"
                workouts={this.state.workouts}
                fieldName="bench_press"
                chartSeries={
                  [
                    {
                      field: 'bench_press',
                      name: 'Bench Press',
                      color: '#0000FF'
                    }
                  ]
                }
                width={width}
                height={height}
                margins={margins}
              />
              <WorkoutGraph
                title="Barbell Rows"
                workouts={this.state.workouts}
                fieldName="barbell_rows"
                chartSeries={
                  [
                    {
                      field: 'barbell_rows',
                      name: 'Barbell Rows',
                      color: '#00FF00'
                    }
                  ]
                }
                width={width}
                height={height}
                margins={margins}
              />
              <WorkoutGraph
                title="Overhead Press"
                workouts={this.state.workouts}
                fieldName="overhead_press"
                chartSeries={
                  [
                    {
                      field: 'overhead_press',
                      name: 'Overhead Press',
                      color: '#FFAA33'
                    }
                  ]
                }
                width={width}
                height={height}
                margins={margins}
              />
              <WorkoutGraph
                title="Deadlifts"
                workouts={this.state.workouts}
                fieldName="deadlifts"
                chartSeries={
                  [
                    {
                      field: 'deadlifts',
                      name: 'Deadlifts',
                      color: '#00FFFF'
                    }
                  ]
                }
                width={width}
                height={height}
                margins={margins}
              />
            </div>
          )
        }
      </div>
    );
  }
});

ReactDOM.render(
  <StatsPage
    getUrl="/api/workouts/get-all-workouts"
    avgUrl="/api/workouts/get-workout-averages"
    maxUrl="/api/workouts/get-workout-maxes"
    pollInterval={5000}
  />,
  document.getElementById('content')
);
