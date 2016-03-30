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
      workouts: []
    };
  },
  // Load workouts from the server to display
  loadWorkoutsFromServer: function() {
    $.get({
      url: this.props.getUrl,
      dataType: 'json',
      success: (data) => {
        this.setState({
          workouts: data.workouts
        });
      },
      failure: (xhr, status, err) => {
        console.err(this.props.getUrl, status, err.toString());
      }
    });
  },
  componentDidMount: function() {
    this.loadWorkoutsFromServer();
    setInterval(this.loadWorkoutsFromServer, this.props.pollInterval);
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
          workouts={this.state.workouts}
        />
      </div>
    );
  }
});

ReactDOM.render(
  <StatsPage
    getUrl="/api/get-workouts"
    pollInterval={5000}
  />,
  document.getElementById('content')
);
