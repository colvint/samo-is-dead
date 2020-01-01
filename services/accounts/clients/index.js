
const io = require('socket.io-client');

const { SERVICES: { ACCOUNTS } } = require('../../../config');
const { socketOptionsforClient } = require('../../../system/connections');

module.exports = {
  accountsSocketClient: io(`http://localhost:${ACCOUNTS.SOCKET_PORT}`, socketOptionsforClient(ACCOUNTS.NAME)),
};
