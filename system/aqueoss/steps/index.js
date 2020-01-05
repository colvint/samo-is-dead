const { call } = require('effects-as-data');

const { dbSelectWhere, sendActionTo } = require('../effects');

const resolveQuery = function * (db, tableName, criteria) {
  return yield dbSelectWhere(db, tableName, criteria);
};

const invokeRemoteStep = (client, stepName) => _ => function * (action) {
  return yield sendActionTo(client, stepName, action);
};

const ackStep = step => (action, ack) => call(step, action, ack);

module.exports = {
  ackStep,
  invokeRemoteStep,
  resolveQuery,
};
