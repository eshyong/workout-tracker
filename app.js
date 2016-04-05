'use strict';

// Third party packages
var bcrypt = require('bcrypt'),
  bodyParser = require('body-parser'),
  express = require('express'),
  morgan = require('morgan'),
  redis = require('redis'),
  session = require('express-session'),
  RedisStore = require('connect-redis')(session),
  app = express();

// Local packages
var db = require('./server/db'),
  workouts = require('./server/workouts'),
  users = require('./server/users'),
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
app.use(morgan('combined', {
  skip: function(req, res) {
    return (
      req.method === 'GET' &&
      (req.path === '/api/get-workouts' || req.path === '/login')
    );
  }
}));

// Use redis for client sessions
var redisClient = redis.createClient({
  host: '127.0.0.1',
  port: 6379,
  password: process.env.REDIS_PW
});

redisClient.on('error', function(err) {
  throw err;
});

redisClient.on('ready', function() {
  console.log('Connected to redis');
});

// Client login sessions
app.use(session({
  store: new RedisStore({
    client: redisClient
  }),
  secret: process.env.COOKIE_SECRET,
  resave: false,
  saveUninitialized: true,
  unset: 'destroy'
}));

// Check for authentication on all pages, except for login pages and api calls
app.use(function(req, res, next) {
  if (!req.session.userInfo &&
    req.path !== '/login' &&
    req.path !== '/api/register' &&
    req.path !== '/api/login'
  ) {
    // Redirect user to login page
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

app.get('/stats', function(req, res) {
  res.sendFile('stats.html', sendFileOpts);
});

app.get('/login', function(req, res) {
  if (req.session.userInfo) {
    // Redirect to home page if already authenticated
    res.redirect('/');
  } else {
    res.sendFile('login.html', sendFileOpts);
  }
});

app.get('/profile', function(req, res) {
  res.sendFile('profile.html', sendFileOpts);
});

app.get('/logout', function(req, res) {
  if (req.session.userInfo) {
    // Destroy user session on logout
    req.session.destroy(function(err) {
      if (err) {
        console.log('Unable to destroy session: ', err);
      }
    });
  }
  res.redirect('/login');
});

// API endpoints
app.get('/api/username', function(req, res) {
  // Used to display username in the navbar
  if (req.session.userInfo) {
    res.json({
      status: 'success',
      username: req.session.userInfo.username
    });
  } else {
    res.json({
      status: 'failure'
    });
  }
});

app.post('/api/register', function(req, res) {
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
        email: req.body.email,
        password_hash: hash,
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

app.post('/api/login', function(req, res) {
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

    // Calculate hash from salt and password and attempt to authenticate user
    var userInfo = results[0];
    bcrypt.compare(req.body.password, userInfo.password_hash, function(err, matches) {
      if (err) {
        // bcrypt failed somehow, throw fast
        throw err;
      }

      // Calculated hash doesn't match stored hash
      if (!matches) {
        res.json({
          status: 'failure',
          message: 'Username or password was entered incorrectly, please try again.'
        });
        return;
      }

      // Successfully authenticate user and set session ID
      console.log('Successfully authenticated user.');
      req.session.userInfo = {
        username: userInfo.username,
        userId: userInfo.id
      };
      res.json({
        status: 'success',
        redirectUrl: '/'
      });
    });
  });
});

app.get('/api/get-user-email', function(req, res) {
  users.getUserEmailForId(conn, req.session.userInfo.userId, function(err, results) {
    if (err) {
      // Generic DB error
      console.log('Encountered database err: ' + err.message);
      res.json({
        status: 'failure',
        message: 'Failed to get user email.'
      });
      return;
    }

    // Return user email address
    var email = results[0].email;
    res.json({
      status: 'success',
      email: email.trim()
    });
  });
});

app.post('/api/update-user-email', function(req, res) {
  users.updateUserEmailForId(
    conn, req.session.userInfo.userId, req.body.newEmail,
    function(err, result) {
      if (err) {
        // Generic DB error
        console.log('Encountered database err: ' + err.message);
        res.json({
          status: 'failure',
          message: 'Failed to udpate email address.'
        });
        return;
      }
      // Catch MySQL warnings
      if (result.affectedRows === 0 || result.warningCount > 0) {
        console.log('No error thrown, but failed to delete row');
        db.showWarnings(conn, function(err, result) {
          if (err) {
            throw err;
          }
          console.log('Warning: ' + result[0].Message);
        });
        res.json({
          status: 'failure',
          message: 'Failed to update email address.'
        });
        return;
      }
      res.json({
        status: 'success',
        message: 'Successfully updated email address.'
      });
    }
  );
});

app.post('/api/update-user-password', function(req, res) {
  console.log(req.session.userInfo);
  users.getUserCredentials(conn, {username: req.session.userInfo.username},
    function(err, results) {
      // Generic DB error
      if (err) {
        console.log('Encountered database err: ' + err.message);
        res.json({
          status: 'failure',
          message: 'Unable to update password.'
        });
        return;
      }
      // Should not happen error
      if (results.length === 0) {
        res.json({
          status: 'failure',
          message: 'Unknown error.'
        });
        return;
      }

      // Calculate hash from salt and password and attempt to authenticate user
      var userInfo = results[0];
      bcrypt.compare(req.body.password, userInfo.password_hash, function(err, isMatch) {
        if (err) {
          // bcrypt failed somehow, throw fast
          throw err;
        }

        // Calculated hash doesn't match stored hash
        if (!isMatch) {
          res.json({
            status: 'failure',
            message: 'Password was entered incorrectly, please try again.'
          });
          return;
        }

        // Create a hash from the new desired password
        bcrypt.genSalt(function(err, salt) {
          if (err) {
            // bcrypt failed somehow, throw fast
            throw err;
          }
          bcrypt.hash(req.body.newPassword, salt, function(err, newPasswordHash) {
            if (err) {
              // bcrypt failed somehow, throw fast
              throw err;
            }
            users.updateUserPasswordForId(conn, req.session.userInfo.userId, newPasswordHash,
              function(err, result) {
                // Oh god the callbacks
                if (err) {
                  console.log('Encountered database err: ' + err.message);
                  res.json({
                    status: 'failure',
                    message: 'Unable to update password.'
                  });
                  return;
                }
                // Catch MySQL warnings
                if (result.affectedRows === 0 || result.warningCount > 0) {
                  console.log('No error thrown, but failed to update row');
                  db.showWarnings(conn, function(err, result) {
                    if (err) {
                      throw err;
                    }
                    console.log('Warning: ' + result[0].Message);
                  });
                  res.json({
                    status: 'failure',
                    message: 'Failed to update password.'
                  });
                  return;
                }
                // Finally we've updated the password
                res.json({
                  status: 'success',
                  message: 'Successfully updated password.'
                });
              }
            );
          });
        });
      });
    }
  );
});

app.get('/api/get-workouts', function(req, res) {
  workouts.getWorkouts(conn, req.session.userInfo.userId, function(err, results) {
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

app.get('/api/get-workout-averages', function(req, res) {
  workouts.getWorkoutAverages(conn, req.session.userInfo.userId, function(err, results) {
    if (err) {
      // Generic DB error
      console.log('Encountered database err: ' + err.message);
      res.json({
        status: 'failure',
        message: 'Failed to query workouts.'
      });
      return;
    }
    var averages = results[0];
    res.json({
      status: 'success',
      averages: {
        squats: averages.squats,
        benchPress: averages.bench_press,
        barbellRows: averages.barbell_rows,
        overheadPress: averages.overhead_press,
        deadlifts: averages.deadlifts
      }
    });
  });
});

app.get('/api/get-workout-maxes', function(req, res) {
  workouts.getWorkoutMaxes(conn, req.session.userInfo.userId, function(err, results) {
    if (err) {
      // Generic DB error
      console.log('Encountered database err: ' + err.message);
      res.json({
        status: 'failure',
        message: 'Failed to query workouts.'
      });
      return;
    }
    var maxes = results[0];
    res.json({
      status: 'success',
      maxes: {
        squats: maxes.squats,
        benchPress: maxes.bench_press,
        barbellRows: maxes.barbell_rows,
        overheadPress: maxes.overhead_press,
        deadlifts: maxes.deadlifts
      }
    });
  });
});

app.post('/api/submit-workout', function(req, res) {
  // Add user ID to DB request
  var workout = req.body;
  workout['user_id'] = req.session.userInfo.userId;

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
    req.body, req.body.date, req.session.userInfo.userId,
    function(err, result) {
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
          // Generic DB error
          res.json({
            status: 'failure',
            message: 'Failed to update workout.'
          });
        }
        return;
      }
      // Catch MySQL warnings
      if (result.affectedRows === 0 || result.warningCount > 0) {
        console.log('No error thrown, but failed to delete row');
        db.showWarnings(conn, function(err, result) {
          if (err) {
            throw err;
          }
          console.log('Warning: ' + result[0].Message);
        });
        res.json({
          status: 'failure',
          message: 'Failed to update workout.'
        });
        return;
      }
      res.json({
        status: 'success',
        message: 'Successfully updated workout.'
      });
    });
});

app.post('/api/delete-workout', function(req, res) {
  workouts.deleteWorkout(conn, req.body.date, req.session.userInfo.userId, function(err, result) {
    if (err) {
      // Generic DB error
      console.log('Encountered database err: ' + err.message);
      res.json({
        status: 'failure',
        message: 'Failed to delete workout.'
      });
      return;
    }
    // Catch MySQL warnings
    if (result.affectedRows === 0 || result.warningCount > 0) {
      console.log('No error thrown, but failed to delete row');
      db.showWarnings(conn, function(err, result) {
        if (err) {
          throw err;
        }
        console.log('Warning: ' + result[0].Message);
      });
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
