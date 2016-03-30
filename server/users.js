'use strict';

function logSqlIfVerbose(query) {
  var nodeEnv = process.env.NODE_ENV;
  var logSql = process.env.LOG_SQL;
  if (nodeEnv === 'development' && logSql === 'true') {
    console.log(query.sql);
  }
}

module.exports = {
  getUserCredentials: function(database, user, callback) {
    var queryString = 'SELECT username, id, password_hash ' +
      ' FROM users WHERE username = ?';
    var query = database.query(queryString, user.username, callback);
    logSqlIfVerbose(query);
  },
  registerNewUser: function(database, user, callback) {
    var query = database.query('INSERT INTO users SET ?', user, callback);
    logSqlIfVerbose(query);
  }
};
