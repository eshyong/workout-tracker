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
                link: '/logout',
                text: 'Logout'
              }
            ]
          }
        />
        <StatsBox
          averages={this.state.averages}
          maxes={this.state.maxes}
        />
        <WorkoutGraph
          workouts={this.state.workouts}
          width={1000}
          height={300}
          margins={{
            left: 100,
            right: 100,
            top: 50,
            bottom: 50
          }}
        />
      </div>
    );
  }
});

ReactDOM.render(
  <StatsPage
    getUrl="/api/get-workouts"
    avgUrl="/api/get-workout-averages"
    maxUrl="/api/get-workout-maxes"
    pollInterval={5000}
  />,
  document.getElementById('content')
);
