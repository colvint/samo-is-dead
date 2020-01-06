const { cmds } = require('effects-as-data');
const { path } = require('ramda');

const { broadcastEvent, get, sendEventTo } = require('../effects');
const EVENT_TYPES = require('../events');
const STEP_TYPES = require('./types');

const getRandomUsers = function * (count = 1) {
  const { success, result } = yield cmds.envelope(get(`https://randomuser.me/api/?results=${count}`));

  return {
    success,
    result: success ? result.data.results : JSON.stringify(result)
  };
};

const createAccounts = config => function * (action, ack) {
  const response = yield cmds.call(getRandomUsers, action.data.count);

  if (response.success)
    yield broadcastEvent(config.socket, EVENT_TYPES.STATE_CHANGE_ACCOUNTS_CREATED, response.result);

  ack(response);

  return response.result;
};

const notifyClientAccountsCreated = config => function * (action) {
  yield sendEventTo(
    config.io,
    config.socket.id,
    EVENT_TYPES.TO_CLIENT_ACCOUNTS_CREATED,
    path(['action', 'steps', 'invokeRemoteCreateAccounts', 'result'], action)
  );

  return action;
};

const notifyClientAccountsCreateFailed = config => function * (action) {
  yield sendEventTo(config.io, config.socket.id, EVENT_TYPES.TO_CLIENT_ACCOUNTS_CREATE_FAILED, action.data);

  return action;
};

module.exports = {
  createAccounts,
  getRandomUsers,
  notifyClientAccountsCreated,
  notifyClientAccountsCreateFailed,
  STEP_TYPES
};
