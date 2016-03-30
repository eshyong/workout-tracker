'use strict';

// Internal dependencies
var Navbar = require('./Navbar.jsx'),
    StatsBox = require('./StatsBox.jsx');

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
    this.loadWorkoutAveragesFromServer();
    setInterval(this.loadWorkoutAveragesFromServer, this.props.pollInterval);
    this.loadWorkoutMaxesFromServer();
    setInterval(this.loadWorkoutMaxesFromServer, this.props.pollInterval);
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
