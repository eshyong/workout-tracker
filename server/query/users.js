'use strict';

function logSqlIfVerbose(query) {
  var nodeEnv = process.env.NODE_ENV;
  var logSql = process.env.LOG_SQL;
  if (nodeEnv === 'development' && logSql === 'true') {
    console.log(query.sql);
  }
}

module.exports = {
  getUserCredentials: function(dbConnPool, user, callback) {
    var queryString = 'SELECT username, id, password_hash ' +
      ' FROM users WHERE username = ?';
    var query = dbConnPool.query(queryString, user.username, callback);
    logSqlIfVerbose(query);
  },

  getUserEmailForId: function(dbConnPool, userId, callback) {
    var queryString = 'SELECT email FROM users WHERE id = ?';
    var query = dbConnPool.query(queryString, userId, callback);
    logSqlIfVerbose(query);
  },

  getUsernameForEmail: function(dbConnPool, email, callback) {
    var queryString = 'SELECT username FROM users WHERE email = ?';
    var query = dbConnPool.query(queryString, email, callback);
    logSqlIfVerbose(query);
  },

  updateUserEmailForId: function(dbConnPool, userId, newEmail, callback) {
    var queryString = 'UPDATE users SET email = ? WHERE id = ?';
    var query = dbConnPool.query(queryString, [newEmail, userId], callback);
    logSqlIfVerbose(query);
  },

  updateUserPasswordForId: function(dbConnPool, userId, newPasswordHash, callback) {
    var queryString = 'UPDATE users SET password_hash = ? WHERE id = ?';
    var query = dbConnPool.query(queryString, [newPasswordHash, userId], callback);
    logSqlIfVerbose(query);
  },

  updateUserPasswordForEmail: function(dbConnPool, email, newPasswordHash, callback) {
    var queryString = 'UPDATE users SET password_hash = ? WHERE email = ?';
    var query = dbConnPool.query(queryString, [newPasswordHash, email], callback);
    logSqlIfVerbose(query);
  },

  registerNewUser: function(dbConnPool, user, callback) {
    var query = dbConnPool.query('INSERT INTO users SET ?', user, callback);
    logSqlIfVerbose(query);
  }
};
