const { createAccounts } = require('./steps');

module.exports = [
  {
    up: { run: createAccounts, resultKey: 'accounts' }
  }
];
