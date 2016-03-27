'use strict';

module.exports = {
  getUserCredentials: function(database, user, callback) {
    var queryString = 'SELECT id, password_hash, password_salt ' +
      ' FROM users WHERE username = ?';
    database.query(queryString, user.username, callback);
  },
  registerNewUser: function(database, user, callback) {
    database.query('INSERT INTO users SET ?', user, callback);
  }
};
