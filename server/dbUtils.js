'use strict';

module.exports = {
  showWarnings: function(dbConnPool, callback) {
    dbConnPool.query('SHOW WARNINGS', callback);
  }
};
