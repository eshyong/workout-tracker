'use strict';

// Internal dependencies
var Navbar = require('./Navbar.jsx');

// External dependencies
var React = require('react');
var ReactDOM = require('react-dom');

var ProfilePage = React.createClass({
  render: function() {
    return (
      <div className="ProfilePage">
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
                active: false,
                link: '/stats',
                text: 'Stats'
              },
              {
                active: true,
                link: '#',
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
        <EmailForm
          getEmailUrl={this.props.getEmailUrl}
          updateEmailUrl={this.props.updateEmailUrl}
        />
        <PasswordForm
          updatePasswordUrl={this.props.updatePasswordUrl}
        />
      </div>
    );
  }
});

var EmailForm = React.createClass({
  getInitialState: function() {
    return {
      currentEmail: '',
      newEmail: '',
      success: '',
      failure: ''
    };
  },
  getEmailAddress: function() {
    $.get({
      url: this.props.getEmailUrl,
      success: (response) => {
        if (response.status === 'failure') {
          this.setState({
            failure: response.message
          });
        } else {
          this.setState({
            currentEmail: response.email
          });
        }
      },
      dataType: 'json'
    });
  },
  changeEmail: function(e) {
    e.preventDefault();
    if (!this.state.newEmail) {
      this.setState({
        failure: 'Email field must not be empty.'
      });
      return;
    }

    $.post({
      url: this.props.updateEmailUrl,
      data: JSON.stringify({newEmail: this.state.newEmail}),
      contentType: 'application/json',
      success: (response) => {
        if (response.status === 'success') {
          this.setState({
            success: 'Successfully updated email.'
          });
        } else {
          this.setState({
            failure: response.message
          });
        }
      },
      dataType: 'json',
    })
  },
  onEmailInputChange: function(e) {
    this.setState({
      success: '',
      failure: '',
      newEmail: e.target.value
    });
  },
  componentDidMount: function() {
    this.getEmailAddress();
  },
  render: function() {
    return (
      <div className="EmailForm">
        <h3>Change your email address</h3>
        <form onSubmit={this.changeEmail}>
          <div> {
            this.state.currentEmail ?
              ('Current email address: ' + this.state.currentEmail)
            :
              ('No email address on record.')
          } </div>
          <div>Email:
            <input
              type="text"
              placeholder="your email address"
              onChange={this.onEmailInputChange}
            />
            <input type="submit" placeholder="submit"/>
          </div>
        </form>
        {
          this.state.success ? (
            <div className="successMessage">{this.state.success}</div>
          ) : (
            null
          )
        }
        {
          this.state.failure ? (
            <div className="failureMessage">{this.state.failure}</div>
          ) : (
            null
          )
        }
      </div>
    );
  }
});

var PasswordForm = React.createClass({
  getInitialState: function() {
    return {
      password: '',
      newPassword: '',
      newPasswordAgain: ''
    }
  },
  handleInputChange: function(e) {
    var id = e.target.id;
    var newValue = e.target.value;
    this.setState({
      [id]: newValue
    });
  },
  changePassword: function(e) {
    e.preventDefault();
    // All fields must be filled
    if (!this.state.password || !this.state.newPassword || !this.state.newPasswordAgain) {
      this.setState({
        failure: 'Please fill in all password fields.'
      });
      return;
    }

    // Make sure user enters their password correctly twice
    if (this.state.newPassword !== this.state.newPasswordAgain) {
      this.setState({
        failure: 'Please make sure new password is entered correctly twice.'
      });
      return;
    }

    $.post({
      url: this.props.updatePasswordUrl,
      data: JSON.stringify({
        password: this.state.password,
        newPassword: this.state.newPassword
      }),
      contentType: 'application/json',
      success: (response) => {
        if (response.status === 'success') {
          this.setState({
            success: response.message
          });
        } else {
          this.setState({
            failure: response.message
          });
        }
      },
      dataType: 'json',
    })
  },
  render: function() {
    return (
      <div className="PasswordForm">
        <h3>Change your password</h3>
        <form onSubmit={this.changePassword}>
          <div>Current password:
            <input
              type="password"
              id="password"
              placeholder="current password"
              onChange={this.handleInputChange}
            />
          </div>
          <div>New password:
            <input
              type="password"
              id="newPassword"
              placeholder="new password"
              onChange={this.handleInputChange}
            />
          </div>
          <div>New password again:
            <input
              type="password"
              id="newPasswordAgain"
              placeholder="new password again"
              onChange={this.handleInputChange}
            />
          </div>
          <div>
            <input className="btn btn-default" type="submit"/>
          </div>
        </form>
        {
          this.state.success ? (
            <div className="successMessage">{this.state.success}</div>
          ) : (
            null
          )
        }
        {
          this.state.failure ? (
            <div className="failureMessage">{this.state.failure}</div>
          ) : (
            null
          )
        }
      </div>
    );
  }
});

ReactDOM.render(
  <ProfilePage
    getEmailUrl='/api/get-user-email'
    updateEmailUrl='/api/update-user-email'
    updatePasswordUrl='/api/update-user-password'
  />,
  document.getElementById('content')
);
