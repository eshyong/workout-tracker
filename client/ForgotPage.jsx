'use strict';

// Internal dependencies
var Navbar = require('./Navbar.jsx');

// External dependencies
var React = require('react');
var ReactDOM = require('react-dom');

var ForgotPage = React.createClass({
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
        <ForgotForm
          reminderUrl={this.props.reminderUrl}
        />
      </div>
    );
  }
});

var ForgotForm = React.createClass({
  getInitialState: function() {
    return {
      email: '',
      success: '',
      failure: ''
    };
  },
  handleEmailChange: function(e) {
    this.setState({
      email: e.target.value,
      success: '',
      failure: ''
    });
  },
  sendUsernameReminder: function(e) {
    if (!this.state.email) {
      this.setState({failure: 'Please fill in your email address.'});
      return;
    }
    $.ajax({
      url: this.props.reminderUrl,
      method: 'POST',
      contentType: 'application/json',
      data: JSON.stringify(this.state),
      dataType: 'json',
      success: (response) => {
        if (response.status === 'success') {
          this.setState({success: response.message});
        } else {
          this.setState({failure: response.message});
        }
      },
      failure: (xhr, status, err) => {
        console.err(this.props.getUrl, status, err.toString());
      }
    });
  },
  render: function() {
    return (
      <div className="ForgotForm">
        <h2>Forgot username or password</h2>
        <div>Email address:
          <input
            type="text"
            id="email"
            placeholder="email"
            onChange={this.handleEmailChange}
          />
        </div>
        <input
          className="btn btn-default"
          type="button"
          value="Remind me my username"
          onClick={this.sendUsernameReminder}
        />
        <input
          className="btn btn-default"
          type="button"
          value="Reset my password"
        />
        {
          this.state.success ? (
            <div className="success">{this.state.success}</div>
          ) : (
            null
          )
        } {
          this.state.failure ? (
            <div className="failure">{this.state.failure}</div>
          ) : (
            null
          )
        }
      </div>
    );
  }
});

ReactDOM.render(
  <ForgotPage
    reminderUrl="/api/users/send-username-reminder"
  />,
  document.getElementById('content')
);
