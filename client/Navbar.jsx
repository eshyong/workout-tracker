'use strict';

var React = require('react');

var Navbar = React.createClass({
  render: function() {
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
          <ul className="nav navbar-nav">
            {navbarNodes}
          </ul>
        </div>
      </nav>
    );
  }
});

module.exports = Navbar;
