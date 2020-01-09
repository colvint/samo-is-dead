
const io = require('socket.io-client');

const { VIEWS, SERVICES } = require('@your-organization/config');
const { CONNECTIONS: { socketOptionsforClient } } = require('@fxos/system');

module.exports = {
  accountsSocketClient: io(`http://localhost:${SERVICES.ACCOUNTS.SOCKET_PORT}`, socketOptionsforClient(VIEWS.ACCOUNTS.NAME)),
};
