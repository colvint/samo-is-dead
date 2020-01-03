const { cmds } = require('effects-as-data');

const { get, sendActionTo, sendEventTo } = require('../../effects');
const { CREATE_ACCOUNTS } = require('../types');
const { TO_CLIENT_ACCOUNTS_CREATED } = require('../../events/types');

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

const notifyAccountsCreated = config => function * (action) {
  const payload = action.action.steps.createAccounts.result;

  return yield sendEventTo(config.io, config.socket.id, TO_CLIENT_ACCOUNTS_CREATED, payload);
};

module.exports = {
  createAccounts,
  getRandomUsers,
  notifyAccountsCreated,
};
