const { createAccounts } = require('./steps');

module.exports = [
  {
    up: { type: 'action', name: 'createAccounts', run: createAccounts }
  }
];
