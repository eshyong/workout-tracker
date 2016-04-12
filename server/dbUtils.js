'use strict';

module.exports = {
  showWarnings: function(dbConnection, callback) {
    dbConnection.query('SHOW WARNINGS', callback);
  }
};
