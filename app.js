'use strict';

// Third party packages
var bcrypt = require('bcrypt'),
  bodyParser = require('body-parser'),
  crypto = require('crypto'),
  express = require('express'),
  sessions = require('client-sessions'),
  app = express();

// Local packages
var db = require('./db'),
  workouts = require('./workouts'),
  users = require('./users'),
  conn = db.connect();

var sendFileOpts = {
  root: __dirname + '/public/views'
};

// Middleware setup
app.use(express.static('./public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

// Client login sessions
var cookieSecret = crypto.randomBytes(32).toString('base64');
app.use(sessions({
  cookieName: 'auth',
  secret: cookieSecret,
  // Cookies last one day
  duration: 1000 * 60 * 60 * 24
}));

// Check for authentication on all pages, except for '/login' and '/register'
app.use(function(req, res, next) {
  if (!req.auth.userId && req.path !== '/login' && req.path !== '/register') {
    // Not authed, redirect to login page
    res.redirect('/login');
  } else {
    // Authed
    next();
  }
});

// Pages
app.get('/', function(req, res) {
  res.sendFile('index.html', sendFileOpts);
});

app.get('/login', function(req, res) {
  res.sendFile('login.html', sendFileOpts);
});

app.post('/register', function(req, res) {
  // Generate a salt and hash of the password, then pass the user to the DB
  bcrypt.genSalt(function(err, salt) {
    bcrypt.hash(req.body.password, salt, function(err, hash) {
      if (err) {
        // bcrypt failed somehow, throw fast
        throw err;
      }

      // Send password hash and salt to database
      users.registerNewUser(conn, {
        username: req.body.username,
        password_hash: hash,
        password_salt: salt
      }, function(err) {
        if (err) {
          console.log('Encountered database err: ' + err.message);
          if (err.code === 'ER_DUP_ENTRY') {
            // User already exists error
            res.json({
              status: 'failure',
              message: 'A user with that name already exists.'
            });
          } else {
            // Generic error
            res.json({
              status: 'failure',
              message: 'Unable to register a new user.'
            });
          }
          return;
        }
        console.log('Successfully registered new user!');
        res.json({
          status: 'success',
          message: 'Successfully registered new user!'
        });
      });
    });
  });
});

app.post('/login', function(req, res) {
  // Authenticate user by checking credentials against database
  users.getUserCredentials(conn, {
    username: req.body.username,
  }, function(err, results) {
    // Generic DB error
    if (err) {
      console.log('Encountered database err: ' + err.message);
      res.json({
        status: 'failure',
        message: 'Unable to authenticate user.'
      });
      return;
    }
    // No user found error
    if (results.length === 0) {
      res.json({
        status: 'failure',
        message: 'No user with that name found.'
      });
      return;
    }

    // Calculate hash from salt and password and ensure proper authentication
    var userInfo = results[0];
    bcrypt.hash(req.body.username, userInfo.password_salt, function(err, hash) {
      if (err) {
        // bcrypt failed somehow, throw fast
        throw err;
      }

      // Calculated hash doesn't match stored hash
      if (hash !== userInfo.password_hash) {
        res.json({
          status: 'failure',
          message: 'Username or password was entered incorrectly, please try again.'
        });
        return;
      }

      // Successfully authenticate user and set session ID
      console.log('Successfully authenticated user.');
      req.auth.userId = userInfo.id;
      res.json({
        status: 'success',
        redirectUrl: '/'
      });
    });
  });
});

// API endpoints
app.get('/api/get-workouts', function(req, res) {
  workouts.getWorkouts(conn, req.auth.userId, function(err, results) {
    if (err) {
      // Generic DB error
      console.log('Encountered database err: ' + err.message);
      res.json({
        status: 'failure',
        message: 'Failed to query workouts.'
      });
      return;
    }
    res.json({
      status: 'success',
      workouts: results
    });
  });
});

app.post('/api/submit-workout', function(req, res) {
  // Add user ID to DB request
  var workout = req.body;
  workout['user_id'] = req.auth.userId;

  // Submit workout
  workouts.submitWorkout(conn, req.body, function(err) {
    if (err) {
      console.log('Encountered database err: ' + err.message);
      if (err.code === 'ER_DUP_ENTRY') {
        // Duplicate workout error
        res.json({
          status: 'failure',
          message: 'A workout with that date already exists.'
        });
      } else if (
        err.code === 'ER_TRUNCATED_WRONG_VALUE_FOR_FIELD' ||
        err.code === 'ER_WARN_DATA_OUT_OF_RANGE'
      ) {
        // Invalid user input error
        res.json({
          status: 'failure',
          message: 'Invalid input - please check that your exercise weights are ' +
            'positive integers.'
        });
      } else {
        // Generic error
        res.json({
          status: 'failure',
          message: 'Failed to insert workout.'
        });
      }
      return;
    }
    console.log('Successfully added workout.');
    res.json({
      status: 'success'
    });
  });
});

app.post('/api/update-workout', function(req, res) {
  workouts.updateWorkout(conn,
    req.body, req.body.date, req.auth.userId,
    function(err, result) {
      if (err) {
        // Generic DB error
        console.log('Encountered database err: ' + err.message);
        res.json({
          status: 'failure',
          message: 'Failed to update workout.'
        });
        return;
      }
      res.json({
        status: 'success',
        message: 'Successfully updated workout.'
      })
    });
});

app.post('/api/delete-workout', function(req, res) {
  workouts.deleteWorkout(conn, req.body, req.auth.userId, function(err) {
    if (err) {
      // Generic DB error
      console.log('Encountered database err: ' + err.message);
      res.json({
        status: 'failure',
        message: 'Failed to delete workout.'
      });
      return;
    }
    res.json({
      status: 'success'
    });
  });
});

if (process.env.NODE_ENV === 'development') {
  app.listen(8080, '0.0.0.0');
  console.log('Listening on http://0.0.0.0:8080');
}
