const io = require('socket.io-client');

const { SERVICES: { EDGE } } = require('@your-organization/config');
const { CONNECTIONS: { socketOptionsforClient } } = require('@fxos/system');

module.exports = {
  accountsSocketClient: io(`http://accounts-service`, socketOptionsforClient(EDGE.NAME)),
};
