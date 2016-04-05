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
          getUrl={this.props.getUrl}
          postUrl={this.props.postUrl}
        />
        <PasswordForm/>
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
      url: this.props.getUrl,
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
      url: this.props.postUrl,
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
  render: function() {
    return (
      <div className="PasswordForm">
        <h3>Change your password</h3>
        <form>
          <div>Current password:
            <input type="text" placeholder="current password"/>
          </div>
          <div>New password:
            <input type="text" placeholder="new password"/>
          </div>
          <div>New password again:
            <input type="text" placeholder="new password again"/>
          </div>
        </form>
      </div>
    );
  }
});

ReactDOM.render(
  <ProfilePage
    getUrl='/api/get-user-email'
    postUrl='/api/update-user-email'
  />,
  document.getElementById('content')
);
