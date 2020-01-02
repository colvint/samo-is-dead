
const io = require('socket.io-client');

const { VIEWS, SERVICES } = require('../../../config');
const { socketOptionsforClient } = require('../../../system/connections');

module.exports = {
  accountsSocketClient: io(`http://localhost:${SERVICES.ACCOUNTS.SOCKET_PORT}`, socketOptionsforClient(VIEWS.ACCOUNTS.NAME)),
};
