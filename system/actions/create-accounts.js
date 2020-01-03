const { createAccounts, notifyAccountsCreated } = require('./steps');

module.exports = [
  {
    up: { name: 'createAccounts', run: createAccounts },
  },
  {
    up: { name: 'notifyAccountsCreated', run: notifyAccountsCreated },
  }
];
