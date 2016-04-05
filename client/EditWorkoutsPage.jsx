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
      success: (data) => {
        this.setState({
          data: data.workouts
        });
      },
      failure: (xhr, status, err) => {
        console.err(this.props.getUrl, status, err.toString());
      }
    });
  },
  // Helper function for workout POST functions
  handlePost: function(url, workout, callback) {
    $.ajax({
      url: url,
      method: 'POST',
      contentType: 'application/json',
      data: JSON.stringify(workout),
      dataType: 'json',
      success: (data) => {
        callback(data);
      },
      failure: (xhr, status, err) => {
        console.err(this.props.url, status, err.toString());
      }
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
                link: '/stats',
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
        <h2>Submit a new workout</h2>
        <div className="submitter">
          <WorkoutForm
            date={moment.utc()}
            squats="0"
            benchPress="0"
            barbellRows="0"
            overheadPress="0"
            deadlifts="0"
            onWorkoutSubmit={this.handleWorkoutSubmit}
            isTypeA={true}
            submitter={true}
            id="Submitter"
          />
        </div>
        <h2>View and edit workouts</h2>
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
    pollInterval={3000}
  />,
  document.getElementById('content')
);
