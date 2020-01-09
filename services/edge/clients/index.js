const io = require('socket.io-client');

const { SERVICES: { ACCOUNTS, EDGE } } = require('@your-organization/config');
const { CONNECTIONS: { socketOptionsforClient } } = require('@fxos/system');

module.exports = {
  accountsSocketClient: io(`http://localhost:${ACCOUNTS.SOCKET_PORT}`, socketOptionsforClient(EDGE.NAME)),
};
