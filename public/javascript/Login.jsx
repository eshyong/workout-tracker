'use strict';

var LoginScreen = React.createClass({
  registerNewUser: function(userData, callback) {
    $.ajax({
      url: this.props.registerUrl,
      method: 'POST',
      data: userData,
      dataType: 'json',
      success: function(response) {
        callback(response);
      }.bind(this),
      failure: function(xhr, status, err) {
        console.err(this.props.getUrl, status, err.toString());
      }.bind(this)
    });
  },
  render: function() {
    return (
      <div className="loginScreen">
        <h2>Login as a returning user</h2>
        <LoginForm/>
        <h2>Or, register as a new user</h2>
        <RegisterForm registerNewUser={this.registerNewUser}/>
      </div>
    );
  }
});

var LoginForm = React.createClass({
  getInitialState: function() {
    return {
      username: '',
      password: ''
    }
  },
  handleInputChange: function(e) {
    var id = e.target.id,
        newValue = e.target.value;
    this.setState({
      [id]: newValue
    });
  },
  handleSubmit: function(e) {
    e.preventDefault();
    // TODO: Implement login
  },
  render: function() {
    return (
      <form className="loginForm" onSubmit={this.handleSubmit}>
        <div>
          <input
            type="text"
            id="username"
            placeholder="username"
            onChange={this.handleInputChange}
          />
        </div>
        <div>
          <input
            type="password"
            id="password"
            placeholder="password"
            onChange={this.handleInputChange}
          />
        </div>
        <div>
          <input type="submit" value="Submit"/>
        </div>
      </form>
    );
  }
});

var RegisterForm = React.createClass({
  getInitialState: function() {
    return {
      username: '',
      password: '',
      passwordAgain: '',
      success: '',
      failure: ''
    }
  },
  handleInputChange: function(e) {
    var id = e.target.id,
      newValue = e.target.value;
    this.setState({
      [id]: newValue
    });
  },
  handleSubmit: function(e) {
    // Prevent page reload
    e.preventDefault();

    // Reset status messages
    this.success = '';
    this.failure = '';

    // Trim extra whitespace around words
    var username = this.state.username.trim(),
        password = this.state.password.trim(),
        passwordAgain = this.state.passwordAgain.trim();

    // Form validation
    if (!username || !password) {
      this.setState({
        failure: 'Need to fill both username and password in'
      });
      return;
    }
    if (password !== passwordAgain) {
      this.setState({
        failure: 'First password does not match second'
      });
      return;
    }

    // Try registering a new user
    this.props.registerNewUser({
      username: username,
      password: password
    }, (response) => {
      if (response.status === 'success') {
        this.setState({
          success: response.message
        });
      } else if (response.status === 'failure') {
        this.setState({
          failure: response.message
        });
      } else {
        this.setState({
          failure: 'Unknown response type'
        });
      }
    });
  },
  render: function() {
    return (
      <div className="registerForm">
        <form onSubmit={this.handleSubmit}>
          <div>
            <input
              type="text"
              id="username"
              placeholder="username"
              onChange={this.handleInputChange}
            />
          </div>
          <div>
            <input
              type="password"
              id="password"
              placeholder="password"
              onChange={this.handleInputChange}
            />
          </div>
          <div>
            <input
              type="password"
              id="passwordAgain"
              placeholder="password again"
              onChange={this.handleInputChange}
            />
          </div>
          <div>
            <input type="submit" value="Submit"/>
          </div>
        </form>
        {
          this.state.success ?
            <div className="successMessage">{this.state.success}</div>
            : null
        }
        {
          this.state.failure ?
            <div className="failureMessage">{this.state.failure}</div>
            : null
        }
      </div>
    );
  }
});

ReactDOM.render(
  <LoginScreen/>,
  document.getElementById('content')
);
