const { dbSelectWhere } = require('../../system/effects')

const resolveQuery = function * (db, tableName, criteria) {
  return yield dbSelectWhere(db, tableName, criteria);
};

module.exports = {
  resolveQuery
};
