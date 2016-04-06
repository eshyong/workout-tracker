'use strict';

// Internal dependencies
var Navbar = require('./Navbar.jsx');

// External dependencies
var React = require('react'),
    ReactDOM = require('react-dom');

var ForgotPage = React.createClass({
  getInitialState: function() {
    return {
      username: ''
    }
  },
  handleInputChange: function(e) {
    var id = e.target.id;
    var newValue = e.target.value;
    this.setState({
      [id]: newValue
    });
  },
  render: function() {
    return (
      <div className="ForgotPage">
        <Navbar
          items={
            // List of navbar items
            [
              {
                active: true,
                link: '/login',
                text: 'Login'
              },
              {
                active: false,
                link: '/logout',
                text: 'Logout'
              }
            ]
          }
        />
        <h2>Forgot username or password</h2>
        <div>Email address:
          <input
            type="text"
            id="email"
            className="inputBox"
            placeholder="email"
            onChange={this.handleInputChange}
          />
        </div>
        <input
          className="btn btn-default"
          type="button"
          value="Remind me my username"
        />
        <input
          className="btn btn-default"
          type="button"
          value="Reset my password"
        />
      </div>
    );
  }
});

ReactDOM.render(
  <ForgotPage/>,
  document.getElementById('content')
);
