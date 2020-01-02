const { call } = require('effects-as-data');

const { accountsSocketClient } = require('./clients');
const { insertAccounts } = require('./persistors');
const dbConfig = require('./knexfile');
const accountsDb = require('knex')(dbConfig);
const EVENT_TYPES = require('../../system/events/types');

accountsSocketClient
  .on(EVENT_TYPES.STATE_CHANGE_ACCOUNTS_CREATED, accounts => call(insertAccounts, accountsDb, accounts));
