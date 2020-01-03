const { createAccounts, notifyAccountsCreated, notifyClientAccountsCreateFailed } = require('./steps');

module.exports = [
  {
    up: { name: 'createAccounts', run: createAccounts },
    down: { name: 'notifyClientAccountsCreateFailed', run: notifyClientAccountsCreateFailed }
  },
  {
    up: { name: 'notifyAccountsCreated', run: notifyAccountsCreated },
  }
];
