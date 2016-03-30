'use strict';

var React = require('react');

var Navbar = React.createClass({
  getInitialState: function() {
    return {
      username: ''
    };
  },
  componentDidMount: function() {
    $.get({
      url: '/api/username',
      dataType: 'json',
      success: (response) => {
        if (response.status === 'success') {
          this.setState({
            username: response.username
          });
        }
      }
    });
  },
  render: function() {
    console.log(this.state);
    var navbarNodes = this.props.items.map((item) => {
      return (
        <li className={item.active ? "active" : ""} key={item.link}>
          <a href={item.link}>{item.text}</a>
        </li>
      );
    });
    return (
      <nav className="Navbar navbar navbar-default">
        <div className="container-fluid">
          <div className="navbar-header">
            <a className="navbar-brand" href="#">Workout tracker</a>
          </div>
          <p className="navbar-text navbar-right">
            {
              this.state.username ? "Signed in as " + this.state.username : ""
            }
          </p>
          <ul className="nav navbar-nav">
            {navbarNodes}
          </ul>
        </div>
      </nav>
    );
  }
});

module.exports = Navbar;
