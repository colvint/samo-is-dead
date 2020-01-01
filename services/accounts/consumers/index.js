const { accountsSocketClient } = require('../clients');
const EVENT_TYPES = require('../../../system/events/types');

accountsSocketClient
  .on(EVENT_TYPES.STATE_CHANGE_ACCOUNTS_CREATED, console.log);
