'use strict';

// Internal dependencies
var Navbar = require('./Navbar.jsx'),
    WorkoutForm = require('./WorkoutForm.jsx'),
    WorkoutList = require('./WorkoutList.jsx');

// External dependencies
var moment = require('moment'),
    React = require('react'),
    ReactDOM = require('react-dom');

var WorkoutBox = React.createClass({
  getInitialState: function() {
    return {
      data: []
    };
  },
  // Load workouts from the server to display
  loadWorkoutsFromServer: function() {
    $.ajax({
      url: this.props.getUrl,
      dataType: 'json',
      success: function(data) {
        this.setState({
          data: data.workouts
        });
      }.bind(this),
      failure: function(xhr, status, err) {
        console.err(this.props.getUrl, status, err.toString());
      }.bind(this)
    });
  },
  // Helper function for workout POST functions
  handlePost: function(url, workout, callback) {
    $.ajax({
      url: url,
      method: 'POST',
      data: workout,
      dataType: 'json',
      success: function(data) {
        callback(data);
      }.bind(this),
      failure: function(xhr, status, err) {
        console.err(this.props.url, status, err.toString());
      }.bind(this)
    });
  },
  handleWorkoutSubmit: function(workout, callback) {
    this.handlePost(this.props.submitUrl, workout, callback);
  },
  handleWorkoutUpdate: function(workout, callback) {
    this.handlePost(this.props.updateUrl, workout, callback);
  },
  handleWorkoutDelete: function(workout, callback) {
    this.handlePost(this.props.deleteUrl, workout, callback);
  },
  componentDidMount: function() {
    this.loadWorkoutsFromServer();
    setInterval(this.loadWorkoutsFromServer, this.props.pollInterval);
  },
  render: function() {
    return (
      <div className="WorkoutBox">
        <Navbar
          items={
            // List of navbar items
            [
              {
                active: true,
                link: '#',
                text: 'Home'
              },
              {
                active: false,
                link: '/logout',
                text: 'Logout'
              }
            ]
          }
        />
        <WorkoutForm
          date={moment.utc()}
          squats="0"
          benchPress="0"
          barbellRows="0"
          overheadPress="0"
          deadlifts="0"
          onWorkoutSubmit={this.handleWorkoutSubmit}
        />
        <WorkoutList
          data={this.state.data}
          onWorkoutUpdate={this.handleWorkoutUpdate}
          onWorkoutDelete={this.handleWorkoutDelete}
        />
      </div>
    );
  }
});

ReactDOM.render(
  <WorkoutBox
    getUrl="/api/get-workouts"
    submitUrl="/api/submit-workout"
    updateUrl="/api/update-workout"
    deleteUrl="/api/delete-workout"
    pollInterval={10000}
  />,
  document.getElementById('content')
);
