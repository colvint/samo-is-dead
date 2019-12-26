const { CREATE_ACCOUNTS } = require('../actions/types');

module.exports = {
  [CREATE_ACCOUNTS]: require('../sagas/create-accounts')
};
