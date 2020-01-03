const { cmds } = require('effects-as-data');
const { path } = require('path');

const { get, sendActionTo, sendEventTo } = require('../../effects');
const { CREATE_ACCOUNTS } = require('../types');
const { TO_CLIENT_ACCOUNTS_CREATED, TO_CLIENT_ACCOUNTS_CREATE_FAILED } = require('../../events/types');

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

const notifyClientAccountsCreated = config => function * (action) {
  const payload = path(['action', 'steps', 'createAccounts', 'result'], action);

  return yield sendEventTo(config.io, config.socket.id, TO_CLIENT_ACCOUNTS_CREATED, payload);
};

const notifyClientAccountsCreateFailed = config => function * (action) {
  return yield sendEventTo(config.io, config.socket.id, TO_CLIENT_ACCOUNTS_CREATE_FAILED, action.data);
};

module.exports = {
  createAccounts,
  getRandomUsers,
  notifyClientAccountsCreated,
  notifyClientAccountsCreateFailed,
};
