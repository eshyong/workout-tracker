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
        <ProfileForm/>
      </div>
    );
  }
});

var ProfileForm = React.createClass({
  getInitialState: function() {
    return {};
  },
  render: function() {
    return (
      <div className="ProfileForm">
        <h3>Change your email address</h3>
        <form>
          <div> {
            this.state.emailAddress ?
              ('Current email address: ' + this.state.emailAddress)
            :
              ('No email address on record')
          } </div>
          <div>Email:
            <input type="text" placeholder="your email address"/>
          </div>
          <h3>Change password</h3>
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
  <ProfilePage/>,
  document.getElementById('content')
);
