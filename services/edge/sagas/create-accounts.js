const { accountsSocketClient } = require('../clients');
const { STEPS: { invokeRemoteStep } } = require('@aqueoss/system');
const { STEPS: { notifyClientAccountsCreated, notifyClientAccountsCreateFailed, STEP_TYPES } } = require('@your-organization/system');

module.exports = [
  {
    up: { name: 'invokeRemoteCreateAccounts', run: invokeRemoteStep(accountsSocketClient, STEP_TYPES.CREATE_ACCOUNTS) },
    down: { name: 'notifyClientAccountsCreateFailed', run: notifyClientAccountsCreateFailed }
  },
  {
    up: { name: 'notifyClientAccountsCreated', run: notifyClientAccountsCreated },
  }
];
