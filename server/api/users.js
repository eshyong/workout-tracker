'use strict';

// Internal dependencies
var users = require('../query/users');

// External dependencies
var bcrypt = require('bcrypt');
var express = require('express');

module.exports = function(database) {
  var router = express.Router();

  // API endpoints
  router.get('/username', function(req, res) {
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

  router.post('/register', function(req, res) {
    // Generate a salt and hash of the password, then pass the user to the DB
    bcrypt.genSalt(function(err, salt) {
      bcrypt.hash(req.body.password, salt, function(err, hash) {
        if (err) {
          // bcrypt failed somehow, throw fast
          throw err;
        }

        // Send password hash and salt to database
        users.registerNewUser(database, {
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

  router.post('/login', function(req, res) {
    // Authenticate user by checking credentials against database
    users.getUserCredentials(database, {
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

  router.get('/get-user-email', function(req, res) {
    users.getUserEmailForId(database, req.session.userInfo.userId, function(err, results) {
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

  router.post('/update-user-email', function(req, res) {
    users.updateUserEmailForId(
      database, req.session.userInfo.userId, req.body.newEmail,
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
          db.showWarnings(database, function(err, result) {
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

  router.post('/update-user-password', function(req, res) {
    users.getUserCredentials(database, {username: req.session.userInfo.username},
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
              users.updateUserPasswordForId(database, req.session.userInfo.userId, newPasswordHash,
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
                    db.showWarnings(database, function(err, result) {
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
  return router;
};
