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
                active: false,
                link: '/login',
                text: 'Login'
              },
              {
                active: true,
                link: '#',
                text: 'Forgot'
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
          resetUrl={this.props.resetUrl}
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
      failure: '',
      processing: false
    };
  },
  handleEmailChange: function(e) {
    this.setState({
      email: e.target.value,
      success: '',
      failure: '',
      processing: false
    });
  },
  sendUsernameReminder: function(e) {
    // Simple form validation
    if (!this.state.email) {
      this.setState({failure: 'Please fill in your email address.'});
      return;
    }

    // Email/database operations may take a while
    this.setState({
      processing: true,
      success: '',
      failure: ''
    });
    $.ajax({
      url: this.props.reminderUrl,
      method: 'POST',
      contentType: 'application/json',
      data: JSON.stringify(this.state),
      dataType: 'json',
      success: (response) => {
        if (response.status === 'success') {
          this.setState({
            success: response.message,
            processing: false
          });
        } else {
          this.setState({
            failure: response.message,
            processing: false
          });
        }
      },
      failure: (xhr, status, err) => {
        console.err(this.props.getUrl, status, err.toString());
      }
    });
  },
  resetPassword: function(e) {
    // Simple form validation
    if (!this.state.email) {
      this.setState({failure: 'Please fill in your email address.'});
      return;
    }

    // Email/database operations may take a while
    this.setState({
      processing: true,
      success: '',
      failure: ''
    });
    $.ajax({
      url: this.props.resetUrl,
      method: 'POST',
      contentType: 'application/json',
      data: JSON.stringify(this.state),
      dataType: 'json',
      success: (response) => {
        if (response.status === 'success') {
          this.setState({
            success: response.message,
            processing: false
          });
        } else {
          this.setState({
            failure: response.message,
            processing: false
          });
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
          onClick={this.resetPassword}
        />
        {
          this.state.processing ? (
            <div className="processing">Processing...</div>
          ) : (
            null
          )
        }
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
    resetUrl="/api/users/reset-user-password"
  />,
  document.getElementById('content')
);
