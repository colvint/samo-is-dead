const { cmds } = require('effects-as-data');
// const { pathOr } = require('ramda');

const { get, sendActionTo } = require('../../effects');
const { CREATE_ACCOUNTS } = require('../types');

// const actionResultPath = key => ['meta', 'saga', 'results', key, 'result'];

const getRandomUsers = function * (count = 1) {
  const { success, result } = yield cmds.envelope(get(`https://randomuser.me/api/?results=${count}`));

  return {
    success,
    result: success ? result.data.results : JSON.stringify(result)
  };
};

const createAccounts = config => function * (action) {
  return yield sendActionTo(config.accountsSocketClient, CREATE_ACCOUNTS, action);
};

// const sendEventTo = function * (eventType, payload, config) {
//   return yield sendEventTo(config.io, config.socket.id, eventType, payload);
// };

module.exports = {
  createAccounts,
  getRandomUsers,
};
